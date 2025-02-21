import { BaseOauthService } from '@/modules/auth/providers/services/base-oauth.service'
import { GoogleProfile, TypeProviderOptions, TypeUserInfo } from '@/modules/auth/providers/services/types'

export class GoogleProvider extends BaseOauthService {
	public constructor(options: TypeProviderOptions) {
		super({
			name: 'google',
			authorize_url: 'https://accounts.google.com/o/oauth2/v2/auth',
			access_url: 'https://oauth2.googleapis.com/token',
			profile_url: 'https://www.googleapis.com/oauth2/v3/userinfo',
			scopes: options.scopes,
			client_id: options.client_id,
			client_secret: options.client_secret
		})
	}

	public async extractUserInfo(data: GoogleProfile): Promise<TypeUserInfo> {
		return super.extractUserInfo({
			id: data.sub,
			email: data.email,
			name: data.name,
			picture: data.picture,
		})
	}
}