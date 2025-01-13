import { Dialect } from 'sequelize';
import { Mode } from '../common/types';
import { SequelizeModuleOptions } from '@nestjs/sequelize';

export interface AppConfig {
	mode: Mode;
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
