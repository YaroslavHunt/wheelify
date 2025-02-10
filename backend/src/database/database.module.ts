import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dialect } from 'sequelize';
import { DatabaseConfig } from '../config/config.types';
import { Mode } from '../common/enums';
import { WinstonLoggerService } from '../logger/logger.service';
import { Sequelize } from 'sequelize-typescript';

export const IDatabaseModule = SequelizeModule.forRootAsync({
	imports: [ConfigModule],
	inject: [ConfigService, WinstonLoggerService],
	useFactory: async (configService: ConfigService,  logger: WinstonLoggerService): Promise<DatabaseConfig> => {
		logger.setLabel('DATABASE');
		const mode = configService.get<string>('app.mode');

		const config: DatabaseConfig = {
			dialect: configService.get<Dialect>('database.dialect'),
			host: configService.get<string>('database.host'),
			port: +configService.get<number>('database.port'),
			username: configService.get<string>('database.username'),
			password: configService.get<string>('database.password'),
			database: configService.get<string>('database.database'),
			autoLoadModels: true,
			synchronize: mode === Mode.DEV,
			logging: mode === Mode.DEV ? (msg) => logger.log(msg) : false,
			timezone: '+00:00',
			dialectOptions: { timezone: 'Etc/UTC' }
		};

		if (!config.host || !config.port || !config.username || !config.password || !config.database) {
			const message = 'Missing database configuration values!' +
				'\nCreate ".env" file with full env variables. (look at ".env-example")';
			logger.error(message);
			throw new Error(message);
		}

		try {
			const sequelize = new Sequelize(config);
			await sequelize.authenticate();
			logger.log(`Successfully connected to database: ${config.database} at ${config.host}:${config.port}`);
		} catch (error) {
			logger.error(`Failed to connect to database: ${config.database} at ${config.host}:${config.port}`, error);
			throw error;
		}

		return config;
	},
});
