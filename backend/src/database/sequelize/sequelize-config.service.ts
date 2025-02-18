import { SequelizeModuleOptions, SequelizeOptionsFactory } from '@nestjs/sequelize'
import { ConfigService } from '@nestjs/config'
import { WinstonLoggerService } from '@/logger/logger.service'
import { AppEnv, DatabaseEnv } from 'src/config/enums'
import { Mode } from '@/libs/common/enums'
import { Injectable } from '@nestjs/common'
import { Dialect } from 'sequelize'

@Injectable()
export class SequelizeConfigService implements SequelizeOptionsFactory {
	constructor(
		private readonly config: ConfigService,
		private readonly logger: WinstonLoggerService
	) {
	}

	createSequelizeOptions(): SequelizeModuleOptions {
		const mode = this.config.getOrThrow<string>(AppEnv.MODE)

		return {
			dialect: this.config.getOrThrow<Dialect>(DatabaseEnv.DIALECT),
			host: this.config.getOrThrow<string>(DatabaseEnv.HOST),
			port: this.config.getOrThrow<number>(DatabaseEnv.PORT),
			username: this.config.getOrThrow<string>(DatabaseEnv.USERNAME),
			password: this.config.getOrThrow<string>(DatabaseEnv.PASSWORD),
			database: this.config.getOrThrow<string>(DatabaseEnv.DATABASE),
			autoLoadModels: true,
			synchronize: mode === Mode.DEV,
			logging: mode === Mode.DEV ? msg => this.logger.log(msg) : false,
			timezone: '+00:00',
			dialectOptions: { timezone: 'Etc/UTC' }
		};
	}
}