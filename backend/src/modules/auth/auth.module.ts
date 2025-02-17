import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import User from '../user/model/user.model'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UserService } from '@/modules/user/user.service'
import { UserValidService } from '@/modules/user/user-validation.service'
import { StorageService } from '@/storage/storage.service'
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { getRecaptchaConfig } from '@/config/configurations/recaptcha.config'
import { ProviderModule } from '@/modules/auth/providers/provider.module'
import { getProvidersConfig } from '@/config/configurations/providers.config'
import Account from '@/modules/auth/model/account.model'

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
		})
		,SequelizeModule.forFeature([User, Account])
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		UserService,
		UserValidService,
		StorageService,
	]
})
export class AuthModule {}
