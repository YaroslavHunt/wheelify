import { ConfigService } from '@nestjs/config'
import { MailerOptions } from '@nestjs-modules/mailer'
import { isDev } from '@/libs/common/utils/is-dev.util'
import { DEFAULT_MAILER_API_NAME, DEFAULT_MAILER_HOST, DEFAULT_MAILER_PORT } from '@/libs/common/constants'

export const getMailerConfig = async (
	config: ConfigService
): Promise<MailerOptions> => ({
	transport: {
		host: config.getOrThrow<string>('MAIL_HOST', DEFAULT_MAILER_HOST),
		port: config.getOrThrow<number>('MAIL_PORT', DEFAULT_MAILER_PORT),
		secure: !isDev(config),
		auth: {
			user: config.getOrThrow<string>('MAIL_API_NAME', DEFAULT_MAILER_API_NAME),
			password: config.getOrThrow<string>('MAIL_API_KEY'),
		}
	},
	defaults: {
		from: `"Wheelify Team" <${config.getOrThrow<string>('MAIL_FROM')}>`
	}
})