import { ConfigService } from '@nestjs/config'
import { GoogleRecaptchaModuleOptions } from '@nestlab/google-recaptcha'

export const getRecaptchaConfig = async (
	config: ConfigService
): Promise<GoogleRecaptchaModuleOptions> => ({
	secretKey: config.getOrThrow<string>('GOOGLE_RECAPTCHA_SECRET_KEY'),
	response: req => req.headers.recaptcha,
	skipIf: process.env.NODE_ENV === 'development'
})