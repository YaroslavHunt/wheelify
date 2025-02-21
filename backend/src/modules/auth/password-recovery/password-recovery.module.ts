import { forwardRef, Module } from '@nestjs/common'
import { PasswordRecoveryService } from './password-recovery.service'
import { PasswordRecoveryController } from './password-recovery.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import Token from '@/modules/auth/models/token.model'
import User from '@/modules/user/model/user.model'
import { UserModule } from '@/modules/user/user.module'
import { MailModule } from '@/libs/mail/mail.module'

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
