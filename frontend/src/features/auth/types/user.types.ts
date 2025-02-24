export enum UserRole {
	ADMIN = 'admin',
	MODERATOR = 'moderator',
	USER = 'user'
}

export enum AuthMethod {
	CREDENTIAL = 'CREDENTIAL',
	GOOGLE = 'GOOGLE'
}

export interface IAccount {
	id: string
	email: string
	type: string
	provider: string
	accessToken: string
	refreshToken: string
	expiresAt: number
	userId: string
	createdAt: string
}

export interface IUser {
	id: string
	username: string
	firstname: string
	lastname: string
	password: string
	email: string
	phone: string
	avatar: string
	role: UserRole
	isActive: boolean
	isVerified: boolean
	isTwoFactorEnabled: boolean
	method: AuthMethod
	accounts: IAccount[]
	// advertisements: Ads[] //TODO
	createdAt: string
	updatedAt: string
}