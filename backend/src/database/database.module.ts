import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { DynamicModule } from '@nestjs/common';

export const DatabaseModule: DynamicModule = SequelizeModule.forRootAsync({
	imports: [ConfigModule],
	inject: [ConfigService],
	useFactory: (configService: ConfigService) => {
		const nodeEnv = configService.get<string>('app.nodeEnv');
		const host = configService.get<string>('database.host');
		const port = configService.get<number>('database.port');
		const username = configService.get<string>('database.username');
		const password = configService.get<string>('database.password');
		const database = configService.get<string>('database.database');

		if (!host || !port || !username || !password || !database) {
			throw new Error('Missing database configuration values!');
		}

		return {
			dialect: 'postgres',
			host,
			port: +port,
			username,
			password,
			database,
			autoLoadModels: true,
			synchronize: nodeEnv === 'development',
			logging: nodeEnv === 'development' ? console.log : false,
		};
	},
});
