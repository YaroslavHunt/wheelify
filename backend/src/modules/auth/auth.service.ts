import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { toDTO } from '@/database/sequelize/utils/mapper.util'
import { WinstonLoggerService } from '@/logger/logger.service'
import { UserLoginReqDTO } from './dto/req/user-login-req.dto'
import { RegisterUserResDTO } from './dto/res/register-user-res.dto'
import User from '../user/model/user.model'
import { UserValidService } from '../user/user-validation.service'
import { UserService } from '../user/user.service'
import { RegisterUserReqDTO } from '@/modules/auth/dto/req/register-user-req.dto'
import { AuthMethod } from '@/libs/common/enums'
import { Request, Response } from 'express'
import { Sequelize } from 'sequelize-typescript'
import { ConfigService } from '@nestjs/config'
import { SessionEnv } from '@/config/enums'
import { LoginResDTO } from '@/modules/auth/dto/res/login-res.dto'
import { ProviderService } from '@/modules/auth/providers/provider.service'
import { DEFAULT_USER_AVATAR } from '@/libs/common/constants'
import { StorageService } from '@/storage/storage.service'
import Account from '@/modules/auth/model/account.model'

@Injectable()
export class AuthService {
	public constructor(
		@InjectModel(User) private readonly userRepository: typeof User,
		@InjectModel(Account) private readonly accountRepository: typeof Account,
		private readonly sequelize: Sequelize,
		private readonly config: ConfigService,
		private readonly logger: WinstonLoggerService,
		private readonly providerService: ProviderService,
		private readonly storageService: StorageService,
		private readonly userService: UserService,
		private readonly userValidService: UserValidService
	) {
	}

	public async register(req: Request, data: RegisterUserReqDTO): Promise<RegisterUserResDTO> {
		const defaultAvatar = await this.storageService.getFileUrl(DEFAULT_USER_AVATAR) || null
		const t = await this.sequelize.transaction()
		try {
			await this.userValidService.checkUserDoesNotExist(data, t)
			const newUser = await this.userService.create(
				data.username,
				data.password,
				data.email,
				false,
				AuthMethod.CREDENTIAL,
				defaultAvatar,
				t
			)
			await this.saveSession(req, newUser)
			await t.commit()
			return toDTO(RegisterUserResDTO, newUser)
		} catch (e) {
			this.logger.log(e.message, AuthService.name)
			await t.rollback()
			throw e
		}
	}

	public async login(req: Request, data: UserLoginReqDTO) {
		try {
			const user = await this.userService.findByEmail(data.email)
			await this.userValidService.checkUserExists(data)
			await this.userValidService.checkPassword(
				data.password,
				user.password
			)
			await this.saveSession(req, user)
			return toDTO(LoginResDTO, user)
		} catch (e) {
			throw e
		}
	}

	public async extractProfileFromCode(req: Request, provider: string, code: string) {
		const providerInstance = this.providerService.findByService(provider)
		const profile = await providerInstance.findUserByCode(code)

		const account = await this.accountRepository.findOne({
			where: { email: profile.email, provider: profile.provider }
		})

		let user = account?.userId ? await this.userService.findById(account.userId) : null
		if (user) {
			return this.saveSession(req, user)
		}

		const t = await this.sequelize.transaction();
		try {
			user = await this.userService.create(
				profile.name,
				'',
				profile.email,
				true,
				AuthMethod[profile.provider.toUpperCase()],
				profile.picture,
				t
			);

			if (!account) {
				await this.accountRepository.create({
					email: profile.email,
					type: 'oauth',
					provider: profile.provider,
					accessToken: profile.access_token,
					refreshToken: profile.refresh_token,
					expiresAt: profile.expires_at,
					userId: user.id,
				}, { transaction: t });
			}

			await t.commit();
		} catch (e) {
			await t.rollback();
			throw new InternalServerErrorException('Failed to process OAuth login');
		}
		return this.saveSession(req, user);
	}


	public async logout(req: Request, res: Response): Promise<void> {
		return new Promise((resolve, reject) => {
			req.session.destroy(err => {
				if (err) {
					return reject(
						new InternalServerErrorException(
							'Could not complete the session. Maybe problems with the server, ' +
							'or the session has already been completed'
						)
					)
				}
				res.clearCookie(this.config.getOrThrow<string>(SessionEnv.NAME))
				resolve()
			})
		})
	}

	private async saveSession(req: Request, user: User) {
		return new Promise((resolve, reject) => {
			req.session.userId = user.id
			req.session.save(err => {
				if (err) {
					return reject(new InternalServerErrorException(
						'The session could not be preserved. ' +
						'Check the session parameters correctly'))
				}
			})

			resolve({ user })
		})
	}
}
