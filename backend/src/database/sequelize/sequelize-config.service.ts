import { SequelizeModuleOptions, SequelizeOptionsFactory } from '@nestjs/sequelize'
import { ConfigService } from '@nestjs/config'
import { WinstonLoggerService } from '@/logger/logger.service'
import { AppEnv, SequelizeEnv } from 'src/config/enums'
import { Mode } from '@/libs/common/enums'
import { Injectable } from '@nestjs/common'
import { Dialect } from 'sequelize'

@Injectable()
export class SequelizeConfigService implements SequelizeOptionsFactory {
	constructor(
		private readonly config: ConfigService,
		private readonly logger: WinstonLoggerService
	) {
		this.logger.setLabel(SequelizeConfigService.name)
	}

	createSequelizeOptions(): SequelizeModuleOptions {
		const mode = this.config.getOrThrow<string>(AppEnv.MODE)

		return {
			dialect: this.config.getOrThrow<Dialect>(SequelizeEnv.DIALECT),
			host: this.config.getOrThrow<string>(SequelizeEnv.HOST),
			port: this.config.getOrThrow<number>(SequelizeEnv.PORT),
			username: this.config.getOrThrow<string>(SequelizeEnv.USERNAME),
			password: this.config.getOrThrow<string>(SequelizeEnv.PASSWORD),
			database: this.config.getOrThrow<string>(SequelizeEnv.DATABASE),
			autoLoadModels: true,
			synchronize: mode === Mode.DEV,
			logging: mode === Mode.DEV ? msg => this.logger.log(msg) : false,
			timezone: '+00:00',
			dialectOptions: { timezone: 'Etc/UTC' }
		};
	}
}