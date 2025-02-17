export type TypeBaseProviderOptions = {
	name: string,
	authorize_url: string,
	access_url: string,
	profile_url: string,
	scopes: string[],
	client_id: string,
	client_secret: string,
}

export type TypeProviderOptions = {
	scopes: string[],
	client_id: string,
	client_secret: string,
}

export type TypeUserInfo = {
	id: string,
	picture: string,
	name: string,
	email: string,
	access_token?: string | null,
	refresh_token?: string,
	expires_at?: number,
	provider: string
}

export interface GoogleProfile extends Record<string, any> {
	aud: string
	azp: string
	email: string
	email_verified: boolean
	exp: number
	family_name?: string
	given_name: string
	hd?: string
	iat: number
	iss: string
	jti?: string
	locale?: string
	name: string
	nbf?: number
	picture: string
	sub: string
	access_token: string,
	refresh_token?: string,
}