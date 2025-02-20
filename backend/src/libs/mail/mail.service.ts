import { Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'
import { AppEnv } from '@/config/enums'
import { render } from '@react-email/components'
import { ConfirmationTemplate } from '@/libs/mail/templates/confirmation.template'
import { ResetPasswordTemplate } from '@/libs/mail/templates/reset-password.temlate'

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

		return this.sendMail(email, 'Email Verification', html)
	}

	public async sendPasswordResetEmail(email: string, token: string) {
		const domain = this.config.getOrThrow<string>(AppEnv.CLIENT)
		const html = await render(ResetPasswordTemplate({ domain, token }))

		return this.sendMail(email, 'Password Reset', html)
	}

	private sendMail(email: string, subject: string, html: string) {
		return this.mailerService.sendMail({
			to: email,
			subject,
			html
		})
	}


}
