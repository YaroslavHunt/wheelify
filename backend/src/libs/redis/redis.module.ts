import { Global, Module } from '@nestjs/common'

import { RedisConfigService } from './redis.service'

@Global()
@Module({
	providers: [RedisConfigService],
	exports: [RedisConfigService]
})
export class RedisModule {}
