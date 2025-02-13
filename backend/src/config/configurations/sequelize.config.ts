import * as process from 'node:process'
import { Dialect } from 'sequelize'
import { SequelizeModuleOptions } from '@nestjs/sequelize'
import { DEFAULT_DB_DIALECT, DEFAULT_HOST } from '@/libs/common/constants'

export default (): SequelizeModuleOptions => ({
	dialect: <Dialect> process.env.DB_DIALECT || DEFAULT_DB_DIALECT,
	host: <string> process.env.DB_HOST || DEFAULT_HOST,
	port: <number> +process.env.DB_PORT || 5432,
	username: <string> process.env.DB_USER,
	password: <string> process.env.DB_PASSWORD,
	database: <string> process.env.DB_NAME,
	uri: <string> `${process.env.DB_DIALECT}://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${+process.env.DB_PORT}/${process.env.DB_NAME}`
})
