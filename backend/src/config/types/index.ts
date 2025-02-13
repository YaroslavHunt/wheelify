import { SequelizeModuleOptions } from '@nestjs/sequelize'

import { Mode } from '@/libs/common/enums'

export interface Configurations {
	admin: AdministratorConfig
	app: AppConfig
	aws: AwsConfig
	jwt: JwtConfig
	redis: RedisConfig
	security: SecurityConfig
	sequelize: SequelizeModuleOptions
	session: SessionConfig
}

export interface AppConfig {
	mode?: Mode
	host?: string
	port?: number
	url: string
}

export interface AwsConfig {
	key: string,
	secret: string,
	region: string,
	s3bucket: string,
	isPublicBucket: boolean
}

export interface JwtConfig {
	secret: string
	accessExpire: string
	refreshExpire: string
}

export interface AdministratorConfig {
	username: string
	password: string
	email: string
}

export interface RedisConfig {
	host: string
	port: number
	username: string
	password: string
	uri: string
}

export interface SecurityConfig {
	cookiesSecret: string
	domains: string[]
}

export interface SessionConfig {
	secret: string
	name: string
	domain: string
	maxAge: string
	httpOnly: boolean
	secure: boolean
	folder: string
}
