import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request, Response } from 'express'
import { Sequelize } from 'sequelize-typescript'

import { DEFAULT_USER_AVATAR } from '@/common/constants'
import { StorageService } from '@/libs/storage/storage.service'
import { RegisterUserReqDTO } from '@/modules/auth/dto/req/register-user-req.dto'
import { UserLoginReqDTO } from '@/modules/auth/dto/req/user-login-req.dto'
import { MailConfirmService } from '@/modules/auth/mail-confirm/mail-confirm.service'
import { TwoFactorAuthService } from '@/modules/auth/two-factor-auth/two-factor-auth.service'

import User from '../user/model/user.model'
import { UserService } from '../user/user.service'

@Injectable()
export class AuthService {
	public constructor(
		private readonly sequelize: Sequelize,
		private readonly storageService: StorageService,
		private readonly userService: UserService,
		private readonly twoFactorAuthService: TwoFactorAuthService,
		private readonly emailConfirmService: MailConfirmService,
		private readonly config: ConfigService
	) {}

	public async register(data: RegisterUserReqDTO) {
		const defaultAvatar =
			await this.storageService.getFileUrl(DEFAULT_USER_AVATAR)
		const t = await this.sequelize.transaction()
		try {
			await this.userService.checkUserDoesNotExist(data, t)
			const newUser = await this.userService.createUser(
				data.username,
				data.password,
				data.email,
				defaultAvatar,
				t
			)

			await this.emailConfirmService.sendVerificationToken(newUser.email)
			await t.commit()
			return {
				message:
					'You have successfully registered. ' +
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
		await this.userService.checkUserExists(data)
		await this.userService.checkPassword(data.password, user.password)
		if (user.isTwoFactorEnabled) {
			if (!data.code) {
				await this.twoFactorAuthService.sendTwoFactorToken(user.email)

				return {
					message:
						'A 2FA authentication code has been sent to your email. ' +
						'Please check your inbox and enter the code to proceed.'
				}
			}
			await this.twoFactorAuthService.validate(user.email, data.code)
		}

		user.lastLogin = new Date()
		await user.save()
		await this.saveSession(req, user)
		return user
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
				res.clearCookie(this.config.getOrThrow<string>('SESSION_NAME'))
				resolve()
			})
		})
	}

	public async saveSession(req: Request, user: User) {
		return new Promise((resolve, reject) => {
			req.session.userId = user.id
			req.session.save(err => {
				if (err) {
					return reject(
						new InternalServerErrorException(
							'The session could not be preserved. ' +
								'Check the session parameters correctly'
						)
					)
				}
			})

			resolve({ user })
		})
	}
}
