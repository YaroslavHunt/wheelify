import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { MailModule } from '@/libs/mail/mail.module'
import Token from '@/modules/auth/models/token.model'
import User from '@/modules/user/model/user.model'
import { UserModule } from '@/modules/user/user.module'

import { PasswordRecoveryController } from './password-recovery.controller'
import { PasswordRecoveryService } from './password-recovery.service'

@Module({
	imports: [
		SequelizeModule.forFeature([Token, User]),
		forwardRef(() => UserModule),
		MailModule
	],
	controllers: [PasswordRecoveryController],
	providers: [PasswordRecoveryService],
	exports: [PasswordRecoveryService]
})
export class PasswordRecoveryModule {}
