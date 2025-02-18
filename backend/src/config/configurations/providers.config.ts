import { ConfigService } from '@nestjs/config'
import { TypeOptions } from '@/modules/auth/providers/services/constants'
import { AppEnv, OAuthEnv } from '@/config/enums'
import { DEFAULT_SERVER_URL } from '@/libs/common/constants'
import { GoogleProvider } from '@/modules/auth/providers/services/google.provider'

export const getProvidersConfig = async (
	config: ConfigService
): Promise<TypeOptions> => ({
	baseUrl: config.getOrThrow<string>(AppEnv.URL) || DEFAULT_SERVER_URL,
	services: [
		new GoogleProvider({
			client_id: config.getOrThrow<string>(OAuthEnv.CLIENT_ID),
			client_secret: config.getOrThrow<string>(OAuthEnv.CLIENT_SECRET),
			scopes: ['email', 'profile'],
		})
	]
})