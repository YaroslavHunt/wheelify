import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { MailModule } from '@/libs/mail/mail.module'
import { StorageService } from '@/libs/storage/storage.service'
import { TwoFactorAuthModule } from '@/modules/auth/two-factor-auth/two-factor-auth.module'
import { UserModule } from '@/modules/user/user.module'

import User from '../user/model/user.model'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { MailConfirmModule } from './mail-confirm/mail-confirm.module'

@Module({
	imports: [
		MailModule,
		forwardRef(() => MailConfirmModule),
		TwoFactorAuthModule,
		forwardRef(() => UserModule),
		SequelizeModule.forFeature([User])
	],
	controllers: [AuthController],
	providers: [AuthService, StorageService],
	exports: [AuthService]
})
export class AuthModule {}
