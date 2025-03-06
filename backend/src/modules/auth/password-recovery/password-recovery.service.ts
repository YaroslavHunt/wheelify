import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { v4 as uuidv4 } from 'uuid'

import { TokenType } from '@/common/enums'
import { MailService } from '@/libs/mail/mail.service'
import Token from '@/modules/auth/models/token.model'
import { NewPasswordDTO } from '@/modules/auth/password-recovery/dto/new-password.dto'
import { ResetPasswordDTO } from '@/modules/auth/password-recovery/dto/reset-password.dto'
import { UserService } from '@/modules/user/user.service'

@Injectable()
export class PasswordRecoveryService {
	public constructor(
		@InjectModel(Token) private readonly tokenRepository: typeof Token,
		private readonly userService: UserService,
		private readonly mailService: MailService
	) {}

	public async resetPassword(data: ResetPasswordDTO) {
		const existingUser = await this.userService.findByEmail(data.email)
		if (!existingUser) {
			throw new NotFoundException(
				`User with email ${data.email} not found`
			)
		}

		const passwordResetToken = await this.generatePasswordResetToken(
			existingUser.email
		)
		await this.mailService.sendPasswordResetEmail(
			passwordResetToken.email,
			passwordResetToken.token
		)

		return true
	}

	public async newPassword(data: NewPasswordDTO, token: string) {
		const existingToken = await this.tokenRepository.findOne({
			where: { token, type: TokenType.PASSWORD_RESET }
		})
		if (!existingToken) {
			throw new NotFoundException('Token not found')
		}
		const isExpired = new Date(existingToken.expiresAt) < new Date()
		if (isExpired) {
			throw new BadRequestException(
				'Token has expired. Please invite a new token to confirm the password reset'
			)
		}
		const existingUser = await this.userService.findByEmail(
			existingToken.email
		)
		if (!existingUser) {
			throw new NotFoundException(
				'User not found. Please make sure you provide a valid email address and try again.'
			)
		}
		existingUser.password = data.password
		await existingUser.save()
		await this.tokenRepository.destroy({
			where: { token, type: TokenType.PASSWORD_RESET }
		})

		return true
	}

	private async generatePasswordResetToken(email: string) {
		const token = uuidv4()
		const expiresAt = new Date(new Date().getTime() + 3600 * 1000)

		const existingToken = await this.tokenRepository.findOne({
			where: {
				email,
				type: TokenType.PASSWORD_RESET
			}
		})
		if (existingToken) {
			await this.tokenRepository.destroy({
				where: {
					id: existingToken.id,
					type: TokenType.PASSWORD_RESET
				}
			})
		}

		return await this.tokenRepository.create({
			email,
			token,
			expiresAt,
			type: TokenType.PASSWORD_RESET
		})
	}
}
