import { RedisModule, RedisModuleOptions } from '@nestjs-modules/ioredis'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RedisEnv } from '@/config/enums'

export const IRedisModule = RedisModule.forRootAsync({
	imports: [ConfigModule],
	inject: [ConfigService],
	useFactory: async (
		configService: ConfigService
	): Promise<RedisModuleOptions> => {
		const url = configService.get<string>(RedisEnv.URI)
		const options = {
			enableAutoPipelining: true,
			maxRetriesPerRequest: 3,
			retryStrategy: (times: number) => {
				return Math.min(times * 50, 2000)
			},
			connectTimeout: 10000
		}

		return {
			type: 'single',
			url,
			options: options
		}
	}
})
