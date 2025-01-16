import { DatabaseConfig } from '../config.types';
import * as process from 'node:process';
import { Dialect } from 'sequelize';

export default (): DatabaseConfig => ({
	dialect: (process.env.DB_DIALECT as Dialect) || 'postgres',
	host: process.env.DB_HOST || 'localhost',
	port: +process.env.DB_PORT || 5432,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});
