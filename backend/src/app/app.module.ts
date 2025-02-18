import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AdsModule } from '@/modules/advertisements/ads.module'
import { AuthModule } from '@/modules/auth/auth.module'
import { TokenModule } from '@/modules/token/token.module'

import configurations from '../config'
import { LoggerModule } from '@/logger/logger.module'
import { AdminModule } from '@/modules/admin/admin.module'
import { UserModule } from '@/modules/user/user.module'
import { StorageModule } from '@/storage/storage.module'
import { DatabaseModule } from '@/database/database.module'
import { RedisModule } from '@/redis/redis.module'
import { IS_DEV } from '@/libs/common/utils/is-dev.util'

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: !IS_DEV,
			isGlobal: true,
			load: [configurations]
		}),
		LoggerModule,
		DatabaseModule,
		StorageModule,
		RedisModule,

		TokenModule,
		AuthModule,
		UserModule,
		AdsModule,
		AdminModule,
	]
})
export class AppModule {}
