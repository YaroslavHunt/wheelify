import { ConfigService } from '@nestjs/config'
import { GoogleRecaptchaModuleOptions } from '@nestlab/google-recaptcha'
import { isDev } from '@/libs/common/utils/is-dev.util'

export const getRecaptchaConfig = async (
	config: ConfigService
): Promise<GoogleRecaptchaModuleOptions> => ({
	secretKey: config.getOrThrow<string>('GOOGLE_RECAPTCHA_SECRET_KEY'),
	response: req => req.headers.recaptcha,
	skipIf: isDev(config)
})