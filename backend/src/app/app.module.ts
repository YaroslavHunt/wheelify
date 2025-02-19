import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AdsModule } from '@/modules/advertisements/ads.module'
import { AuthModule } from '@/modules/auth/auth.module'
import { TokenModule } from '@/modules/token/token.module'

import configurations from '../config'
import { LoggerModule } from '@/libs/logger/logger.module'
import { AdminModule } from '@/modules/admin/admin.module'
import { UserModule } from '@/modules/user/user.module'
import { StorageModule } from '@/libs/storage/storage.module'
import { DatabaseModule } from '@/database/database.module'
import { RedisModule } from '@/libs/redis/redis.module'
import { IS_DEV } from '@/libs/common/utils/is-dev.util'
import { MailModule } from '@/libs/mail/mail.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [configurations],
			ignoreEnvFile: !IS_DEV
		}),
		LoggerModule,
		DatabaseModule,
		StorageModule,
		RedisModule,
		MailModule,

		TokenModule,
		AuthModule,
		UserModule,
		AdsModule,
		AdminModule,
	]
})
export class AppModule {}
