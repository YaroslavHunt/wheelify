import { Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'
import { AppEnv } from '@/config/enums'
import { render } from '@react-email/components'
import { ConfirmationTemplate } from '@/libs/mail/templates/confirmation.template'
import { ResetPasswordTemplate } from '@/libs/mail/templates/reset-password.temlate'
import { TwoFactorAuthTemplate } from '@/libs/mail/templates/two-factor-auth.template'

@Injectable()
export class MailService {
	public constructor(
		private readonly mailerService: MailerService,
		private readonly config: ConfigService
	) {
	}

	public async sendConfirmationEmail(email: string, token: string) {
		const domain = this.config.getOrThrow<string>(AppEnv.CLIENT)
		const html = await render(ConfirmationTemplate({ domain, token }))

		return this.sendMail(email, 'Email verification', html)
	}

	public async sendPasswordResetEmail(email: string, token: string) {
		const domain = this.config.getOrThrow<string>(AppEnv.CLIENT)
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

