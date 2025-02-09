import { RedisModule, RedisModuleOptions } from '@nestjs-modules/ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonLoggerService } from '../modules/logger/logger.service';
import Redis from 'ioredis';

export const IRedisModule = RedisModule.forRootAsync({
	imports: [ConfigModule],
	inject: [ConfigService, WinstonLoggerService],
	useFactory: async (configService: ConfigService, logger: WinstonLoggerService): Promise<RedisModuleOptions> => {
		logger.setLabel('Redis');

		const url = configService.get<string>('redis.url');
		const options = {
			enableAutoPipelining: true,
			maxRetriesPerRequest: 3,
			retryStrategy: (times: number) => {
				logger.log(`Retry attempt ${times} to connect to Redis`);
				return Math.min(times * 50, 2000);
			},
			connectTimeout: 10000,
		}; //TODO settings

		const redis = new Redis(url, options);
		redis.on('connect', () => {
			logger.log(`Successfully connected to Redis at ${url}`);
		});
		redis.on('error', (err) => {
			logger.error(`Error connecting to Redis at ${url}`, err);
		});
		return {
			type: 'single',
			url,
			options: options,
		};
	},
});
