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

@Injectable()
export class AuthService {
	public constructor(
		@InjectModel(User) private readonly userRepository: typeof User,
		private readonly sequelize: Sequelize,
		private readonly config: ConfigService,
		private readonly logger: WinstonLoggerService,
		private readonly userService: UserService,
		private readonly userValidService: UserValidService
	) {
	}

	public async register(req: Request, data: RegisterUserReqDTO): Promise<RegisterUserResDTO> {
		const t = await this.sequelize.transaction()
		try {
			await this.userValidService.checkUserDoesNotExist(data, t)
			const newUser = await this.userService.create(
				data.username,
				data.password,
				data.email,
				false,
				AuthMethod.CREDENTIAL,
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

	async login(req: Request, data: UserLoginReqDTO) {
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
