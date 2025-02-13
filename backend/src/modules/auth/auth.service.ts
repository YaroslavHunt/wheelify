import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { toDTO } from '@/database/sequelize/utils/mapper.util'
import { WinstonLoggerService } from '@/logger/logger.service'
import { TokenService } from '../token/token.service'
import { UserLoginReqDTO } from './dto/req/user-login-req.dto'
import { AuthResponse } from './dto/res/auth-res'
import { RegisterUserResDTO } from './dto/res/register-user-res.dto'
import User from '../user/model/user.model'
import { UserValidService } from '../user/user.validation.service'
import { UserService } from '../user/user.service'
import { RegisterUserReqDTO } from '@/modules/auth/dto/req/register-user-req.dto'
import { AuthMethod } from '@/libs/common/enums'
import { StorageService } from '@/storage/storage.service'
import { Request, Response } from 'express'

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(User) private readonly userRepository: typeof User,
		private readonly userService: UserService,
		private readonly userValidService: UserValidService,
		private readonly tokenService: TokenService,
		private readonly logger: WinstonLoggerService,
		private readonly storage: StorageService
	) {
		this.logger.setLabel(AuthService.name)
	}

	public async register(req: Request, data: RegisterUserReqDTO): Promise<RegisterUserResDTO> {
		// return this.transaction.run(async t => {
			await this.userValidService.checkUserDoesNotExist(data) // t
			const newUser = await this.userService.create(
				data.username,
				data.password,
				data.email,
				false,
				AuthMethod.CREDENTIAL
			)
			const dto = toDTO(RegisterUserResDTO, newUser)
			await this.saveSession(req, newUser)
			return dto;
		// })
	}

	async login(data: UserLoginReqDTO): Promise<AuthResponse> {
		try {
			await this.userValidService.checkUserExists(data)
			const user = await this.userService.findByEmail(data.email)
			await this.userValidService.checkPassword(
				data.password,
				user.password
			)
			const res = new AuthResponse()
			res.user = toDTO(RegisterUserResDTO, user)
			res.token = await this.tokenService.generateJwtToken(res.user)
			return res
		} catch (e) {
			throw e
		}
	}

	public async logout(req: Request, res: Response): Promise<void> {
	}

	private async saveSession(req: Request, user: RegisterUserResDTO) {
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
