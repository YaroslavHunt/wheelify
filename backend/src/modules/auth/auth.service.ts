import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { WinstonLoggerService } from '@/libs/logger/logger.service'
import { UserLoginReqDTO } from './dto/req/user-login-req.dto'
import User from '../user/model/user.model'
import { UserValidService } from '../user/user-validation/user-validation.service'
import { UserService } from '../user/user.service'
import { RegisterUserReqDTO } from '@/modules/auth/dto/req/register-user-req.dto'
import { AuthMethod } from '@/libs/common/enums'
import { Request, Response } from 'express'
import { Sequelize } from 'sequelize-typescript'
import { ConfigService } from '@nestjs/config'
import { SessionEnv } from '@/config/enums'
import { ProviderService } from '@/modules/auth/providers/provider.service'
import { DEFAULT_USER_AVATAR } from '@/libs/common/constants'
import { StorageService } from '@/libs/storage/storage.service'
import Account from '@/modules/auth/models/account.model'
import { MailConfirmService } from '@/modules/auth/mail-confirm/mail-confirm.service'

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
		private readonly emailConfirmService: MailConfirmService,
		private readonly userService: UserService,
		private readonly userValidService: UserValidService
	) {
	}

	public async register(data: RegisterUserReqDTO){
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

			await this.emailConfirmService.sendVerificationToken(newUser)
			await t.commit()
			return {
				message: 'You have successfully registered. ' +
					'A letter has been sent to your mail. ' +
					'Check the specified mail and follow the link to it for successful verification'
			}
		} catch (e) {
			await t.rollback()
			throw e
		}
	}

	public async login(req: Request, data: UserLoginReqDTO) {
			const user = await this.userService.findByEmail(data.email)
			await this.userValidService.checkUserExists(data)
			await this.userValidService.checkPassword(
				data.password,
				user.password
			)
			if(!user.isVerified) {
				await this.emailConfirmService.sendVerificationToken(user)
				throw new UnauthorizedException(
					'Your email is not confirmed. Please check your mail and confirm the address.'
				)
			}
			await this.saveSession(req, user)
			return user
	}

	public async extractProfileFromCode(
		req: Request,
		provider: string,
		code: string
	) {
		const providerInstance = this.providerService.findByService(provider);
		const profile = await providerInstance.findUserByCode(code);

		const t = await this.sequelize.transaction();
		try {
			let user = await this.userRepository.findOne({
				where: { email: profile.email },
				transaction: t,
			});

			let account = await this.accountRepository.findOne({
				where: { email: profile.email, provider: profile.provider },
				transaction: t,
			});

			if (!user) {
				user = await this.userService.create(
					profile.name,
					'',
					profile.email,
					true,
					AuthMethod[profile.provider.toUpperCase()],
					profile.picture,
					t
				);
			}

			if (!account) {
				await this.accountRepository.create(
					{
						email: profile.email,
						type: 'oauth',
						provider: profile.provider,
						accessToken: profile.access_token,
						refreshToken: profile.refresh_token,
						expiresAt: profile.expires_at,
						userId: user.id,
					},
					{ transaction: t }
				);
			}

			await t.commit();
			return this.saveSession(req, user);
		} catch (e) {
			await t.rollback();
			throw new InternalServerErrorException('Failed to process OAuth login');
		}
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
				resolve() //TODO for OAuth2
			})
		})
	}

	public async saveSession(req: Request, user: User) {
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
