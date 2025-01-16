import { Dialect } from 'sequelize';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { Mode } from '../common/enums';

export interface MainConfig {
	app: AppConfig;
	database: DatabaseConfig;
	jwt: JwtConfig;
	admin: AdministratorConfig;
}

export interface AppConfig {
	mode?: Mode;
	port?: number;
}

export interface DatabaseConfig extends SequelizeModuleOptions {
	dialect: Dialect;
	host: string;
	port: number;
	username: string;
	password: string;
	database: string;
}

export interface JwtConfig {
	secret: string;
	expire: string;
}

export interface AdministratorConfig {
	username: string;
	password: string;
	email: string;
}
