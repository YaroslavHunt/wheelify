import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { render } from '@react-email/components'

import { ResetPasswordTemplate } from '@/libs/mail/templates/reset-password.temlate'
import { TwoFactorAuthTemplate } from '@/libs/mail/templates/two-factor-auth.template'

import { ConfirmationTemplate } from './templates/email-confirmation.template'

@Injectable()
export class MailService {
	public constructor(
		private readonly mailerService: MailerService,
		private readonly config: ConfigService
	) {}

	public async sendConfirmationEmail(email: string, token: string) {
		const domain = this.config.getOrThrow<string>('ALLOWED_ORIGIN')
		const html = await render(ConfirmationTemplate({ domain, token }))

		return this.sendMail(email, 'Email verification', html)
	}

	public async sendPasswordResetEmail(email: string, token: string) {
		const domain = this.config.getOrThrow<string>('ALLOWED_ORIGIN')
		const html = await render(ResetPasswordTemplate({ domain, token }))

		return this.sendMail(email, 'Password reset', html)
	}

	public async sendTwoFactorTokenEmail(email: string, token: string) {
		const html = await render(TwoFactorAuthTemplate({ token }))

		return this.sendMail(email, 'Confirmation of personality', html)
	}

	private sendMail(email: string, subject: string, html: string) {
		return this.mailerService.sendMail({
			to: email,
			subject,
			html
		})
	}
}
