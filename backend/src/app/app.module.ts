import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { DatabaseModule } from '@/database/database.module'
import { MailModule } from '@/libs/mail/mail.module'
import { RedisModule } from '@/libs/redis/redis.module'
import { StorageModule } from '@/libs/storage/storage.module'
import { AuthModule } from '@/modules/auth/auth.module'
import { PasswordRecoveryModule } from '@/modules/auth/password-recovery/password-recovery.module'
import { TwoFactorAuthModule } from '@/modules/auth/two-factor-auth/two-factor-auth.module'
import { TimeDocumentModule } from '@/modules/document/time-document.module'
import { EquipmentModule } from '@/modules/equipment/equipment.module'
import { UserModule } from '@/modules/user/user.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		DatabaseModule,
		StorageModule,
		RedisModule,
		//
		AuthModule,
		MailModule,
		PasswordRecoveryModule,
		TwoFactorAuthModule,
		//
		UserModule,
		TimeDocumentModule,
		EquipmentModule
	]
})
export class AppModule {}
