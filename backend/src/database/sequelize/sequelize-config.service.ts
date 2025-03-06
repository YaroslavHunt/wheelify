import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
	SequelizeModuleOptions,
	SequelizeOptionsFactory
} from '@nestjs/sequelize'
import { Dialect } from 'sequelize/types/sequelize'

@Injectable()
export class SequelizeConfigService implements SequelizeOptionsFactory {
	constructor(private readonly config: ConfigService) {}

	createSequelizeOptions(): SequelizeModuleOptions {
		const mode = this.config.getOrThrow<string>('NODE_ENV')

		return {
			dialect: this.config.getOrThrow<Dialect>('DB_DIALECT'),
			host: this.config.getOrThrow<string>('DB_HOST'),
			port: this.config.getOrThrow<number>('DB_PORT'),
			username: this.config.getOrThrow<string>('DB_USER'),
			password: this.config.getOrThrow<string>('DB_PASSWORD'),
			database: this.config.getOrThrow<string>('DB_NAME'),
			autoLoadModels: true,
			synchronize: mode === 'development',
			logging: false,
			timezone: '+00:00',
			dialectOptions: { timezone: 'Etc/UTC' }
		}
	}
}
