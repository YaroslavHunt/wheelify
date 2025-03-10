import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Request } from 'express'
import { v4 as uuidv4 } from 'uuid'

import { TokenType } from '@/common/enums'
import { MailService } from '@/libs/mail/mail.service'
import { AuthService } from '@/modules/auth/auth.service'
import { ConfirmationDTO } from '@/modules/auth/mail-confirm/dto/confirmation.dto'
import Token from '@/modules/auth/models/token.model'
import { UserService } from '@/modules/user/user.service'

@Injectable()
export class MailConfirmService {
	public constructor(
		@InjectModel(Token) private readonly tokenRepository: typeof Token,
		private readonly mailService: MailService,
		private readonly userService: UserService,
		@Inject(forwardRef(() => AuthService))
		private readonly authService: AuthService
	) {}

	public async newVerification(req: Request, dto: ConfirmationDTO) {
		const existingToken = await this.tokenRepository.findOne({
			where: { token: dto.token, type: TokenType.VERIFICATION }
		})
		if (!existingToken) {
			throw new NotFoundException(
				'The token confirmation is not found. Please make sure you have the right token'
			)
		}
		const isExpired = new Date(existingToken.expiresAt) < new Date()
		if (isExpired) {
			throw new BadRequestException(
				'Token has expired. Please invite a new token'
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
		existingUser.isVerified = true
		existingUser.lastLogin = new Date()
		await existingUser.save()
		await this.tokenRepository.destroy({
			where: {
				id: existingToken.id,
				type: TokenType.VERIFICATION
			}
		})
		await this.authService.saveSession(req, existingUser)
		return existingUser
	}

	public async sendVerificationToken(email: string) {
		const verificationToken = await this.generateVerificationToken(email)

		await this.mailService.sendConfirmationEmail(
			verificationToken.email,
			verificationToken.token
		)
		return true
	}

	private async generateVerificationToken(email: string) {
		const token = uuidv4()
		const expiresAt = new Date(new Date().getTime() + 3600 * 1000)

		const existingToken = await this.tokenRepository.findOne({
			where: {
				email,
				type: TokenType.VERIFICATION
			}
		})
		if (existingToken) {
			await this.tokenRepository.destroy({
				where: {
					id: existingToken.id,
					type: TokenType.VERIFICATION
				}
			})
		}

		return await this.tokenRepository.create({
			email,
			token,
			expiresAt,
			type: TokenType.VERIFICATION
		})
	}
}
