import { MailerOptions } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'

export const getMailerConfig = async (
	config: ConfigService
): Promise<MailerOptions> => ({
	transport: {
		host: config.getOrThrow<string>('MAIL_HOST'),
		port: config.getOrThrow<number>('MAIL_PORT'),
		secure: process.env.NODE_ENV !== 'development',
		auth: {
			user: 'apikey',
			pass: config.getOrThrow<string>('MAIL_API_KEY')
		}
	},
	defaults: {
		from: `"TEST" <${config.getOrThrow<string>('MAIL_FROM')}>`
	}
})
