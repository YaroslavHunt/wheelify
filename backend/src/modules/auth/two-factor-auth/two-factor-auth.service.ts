import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { TokenType } from '@/common/enums'
import { MailService } from '@/libs/mail/mail.service'
import Token from '@/modules/auth/models/token.model'

@Injectable()
export class TwoFactorAuthService {
	public constructor(
		@InjectModel(Token) private readonly tokenRepository: typeof Token,
		private readonly mailService: MailService
	) {}

	public async validate(email: string, code: string) {
		const existingToken = await this.tokenRepository.findOne({
			where: { email, type: TokenType.TWO_FACTOR }
		})
		if (!existingToken) {
			throw new NotFoundException(
				'The token 2FA verify is not found. Convince that you invited a token for right email'
			)
		}
		if (existingToken.token !== code) {
			throw new BadRequestException(
				'Wrong code. Please, check the correctness of the code entered and try again'
			)
		}
		const isExpired = new Date(existingToken.expiresAt) < new Date()
		if (isExpired) {
			throw new BadRequestException(
				'Token has expired. Please invite a new token'
			)
		}
		await this.tokenRepository.destroy({
			where: {
				id: existingToken.id,
				type: TokenType.TWO_FACTOR
			}
		})
		return true
	}

	public async sendTwoFactorToken(email: string) {
		const twoFactorToken = await this.generateTwoFactorToken(email)

		await this.mailService.sendTwoFactorTokenEmail(
			twoFactorToken.email,
			twoFactorToken.token
		)
		return true
	}

	private async generateTwoFactorToken(email: string) {
		const token = Math.floor(
			Math.random() * (1000000 - 100000) + 100000
		).toString()
		const expiresAt = new Date(new Date().getTime() + 300000)

		const existingToken = await this.tokenRepository.findOne({
			where: {
				email,
				type: TokenType.TWO_FACTOR
			}
		})
		if (existingToken) {
			await this.tokenRepository.destroy({
				where: {
					id: existingToken.id,
					type: TokenType.TWO_FACTOR
				}
			})
		}
		return await this.tokenRepository.create({
			email,
			token,
			expiresAt,
			type: TokenType.TWO_FACTOR
		})
	}
}
