import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import User from '../user/model/user.model'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UserService } from '@/modules/user/user.service'
import { UserValidService } from '@/modules/user/user-validation.service'
import { StorageService } from '@/libs/storage/storage.service'
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { getRecaptchaConfig } from '@/config/configurations/recaptcha.config'
import { ProviderModule } from '@/modules/auth/providers/provider.module'
import { getProvidersConfig } from '@/config/configurations/providers.config'
import Account from '@/modules/auth/model/account.model'
import { MailConfirmModule } from '@/modules/auth/mail-confirm/mail-confirm.module'
import { MailService } from '@/libs/mail/mail.service'

@Module({
	imports: [
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
		MailService,
		UserService,
		UserValidService,
		StorageService,
	],
	exports: [AuthService],
})
export class AuthModule {}
