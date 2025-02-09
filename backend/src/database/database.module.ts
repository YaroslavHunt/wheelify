import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { DynamicModule } from '@nestjs/common';
import { Dialect } from 'sequelize';
import { DatabaseConfig } from '../config/config.types';
import { Mode } from '../common/enums';
import { WinstonLoggerService } from '../modules/logger/logger.service';

export const DatabaseModule: DynamicModule = SequelizeModule.forRootAsync({
	imports: [ConfigModule],
	inject: [ConfigService, WinstonLoggerService],
	useFactory: (configService: ConfigService,  logger: WinstonLoggerService): DatabaseConfig => {
		logger.setLabel('Database');
		const mode = configService.get<string>('app.mode');
		const dialect = configService.get<Dialect>('database.dialect');
		const host = configService.get<string>('database.host');
		const port = configService.get<number>('database.port');
		const username = configService.get<string>('database.username');
		const password = configService.get<string>('database.password');
		const database = configService.get<string>('database.database');

		if (!host || !port || !username || !password || !database) {
			const message = 'Missing database configuration values!' +
				'\nCreate ".env" file with full env variables. (look at ".env-example")';
			logger.error(message);
			throw new Error(message);
		}

		return {
			dialect,
			host,
			port: +port,
			username,
			password,
			database,
			autoLoadModels: true,
			synchronize: mode === Mode.DEV,
			logging: mode === Mode.DEV ? (msg) => logger.log(msg) : false,
			timezone: '+00:00',
			dialectOptions: { timezone: 'Etc/UTC' }
		};
	},
});
