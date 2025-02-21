import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { TypeBaseProviderOptions, TypeUserInfo } from '@/modules/auth/providers/services/types'

@Injectable()
export class BaseOauthService {
	private BASE_URL: string

	public constructor(private readonly options: TypeBaseProviderOptions) {
	}

	protected async extractUserInfo(data: any): Promise<TypeUserInfo> {
		return {
			...data,
			provider: this.options.name
		}
	}

	public getAuthUrl() {
		const query = new URLSearchParams({
			response_type: 'code',
			client_id: this.options.client_id,
			redirect_uri: this.getRedirectUrl(),
			scope: (this.options.scopes ?? []).join(' '),
			access_type: 'offline',
			prompt: 'select_account'
		})

		return `${this.options.authorize_url}?${query}`
	}

	public async findUserByCode(code: string): Promise<TypeUserInfo> {
		const client_id = this.options.client_id
		const client_secret = this.options.client_secret

		const tokenQuery = new URLSearchParams({
			client_id,
			client_secret,
			code,
			redirect_uri: this.getRedirectUrl(),
			grant_type: 'authorization_code',
		})

		const tokenReq = await fetch(this.options.access_url, {
			method: 'POST',
			body: tokenQuery,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Accept: 'application/json',
			}
		})

		if(!tokenReq.ok) {
			throw new BadRequestException(
				`Could not get ${this.options.profile_url}. Check the token of access`
			)
		}

		const tokens = await tokenReq.json()

		if(!tokens.access_token) {
			throw new BadRequestException(
				`The tokens are absent in ${this.options.access_url}. Make sure the authorization code is valid`
			)
		}

		const userReq = await fetch(this.options.profile_url, {
			headers: {
				Authorization: `Bearer ${tokens.access_token}`,
			}
		})

		if (!userReq.ok) {
			throw new UnauthorizedException(
				`The user could not get from ${this.options.profile_url}. Check the token access`
			)
		}

		const user = await userReq.json()
		const userData = await this.extractUserInfo(user)

		return {
			...userData,
			access_token: tokens.access_token,
			refresh_token: tokens.refresh_token,
			expires_at: tokens.expires_at || tokens.expires_in,
			provider: this.options.name
		}
	}

	public getRedirectUrl() {
		return `${this.BASE_URL}/${process.env.APP_GLOBAL_PREFIX}/auth/oauth/callback/${this.options.name}`
	}

	set baseUrl(value: string) {
		this.BASE_URL = value
	}

	get name() {
		return this.options.name
	}

	get accessUrl() {
		return this.options.access_url
	}

	get profileUrl() {
		return this.options.profile_url
	}

	get scopes() {
		return this.options.scopes
	}
}