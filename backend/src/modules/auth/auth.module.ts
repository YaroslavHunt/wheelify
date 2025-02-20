import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import User from '../user/model/user.model'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { getRecaptchaConfig } from '@/config/configurations/recaptcha.config'
import { ProviderModule } from '@/modules/auth/providers/provider.module'
import { getProvidersConfig } from '@/config/configurations/providers.config'
import Account from '@/modules/auth/models/account.model'
import { MailConfirmModule } from '@/modules/auth/mail-confirm/mail-confirm.module'
import { UserModule } from '@/modules/user/user.module'
import { MailModule } from '@/libs/mail/mail.module'
import { StorageService } from '@/libs/storage/storage.service'
import { UserValidationModule } from '@/modules/user/user-validation/user-validation.module'

@Module({
	imports: [
		MailModule,
		UserValidationModule,
		forwardRef(() => UserModule),
		ProviderModule.registerAsync({
			imports: [ConfigModule],
			useFactory: getProvidersConfig,
			inject: [ConfigService],
		}),
		GoogleRecaptchaModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getRecaptchaConfig,
			inject: [ConfigService]
		}),
		forwardRef(() => MailConfirmModule),
		SequelizeModule.forFeature([User, Account])
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		StorageService,
	],
	exports: [AuthService],
})
export class AuthModule {}
