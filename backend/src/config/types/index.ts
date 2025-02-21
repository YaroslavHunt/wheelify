import { Mode } from '@/libs/common/enums'
import { SequelizeModuleOptions } from '@nestjs/sequelize'
import { RedisOptions } from 'ioredis'
import { SessionOptions } from 'express-session'

export interface Configurations {
	admin: AdministratorOptions,
	app: AppOptions,
	cors: CorsOptions,
	database: SequelizeModuleOptions,
	oauth: OAuthOptions,
	redis: RedisOptions,
	session: SessionOptions,
	storage: StorageOptions
}

export interface StorageOptions {
	key: string;
	secret: string;
	region: string;
	s3bucket: string;
	isPublicBucket: boolean;
}

export interface OAuthOptions {
	client_id: string;
	client_secret: string;
	recaptcha_secret_key: string;
}

export interface CorsOptions {
	domains: string[];
	cookiesSecret: string;
}

export interface AdministratorOptions {
	username: string;
	password: string;
	email: string;
}

export interface AppOptions {
	mode: Mode;
	host: string;
	port: number;
	prefix: string;
	client: string;
	url: string;
}






