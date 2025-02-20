import { forwardRef, Module } from '@nestjs/common'
import { MailConfirmService } from './mail-confirm.service'
import { MailConfirmController } from './mail-confirm.controller'
import { MailModule } from '@/libs/mail/mail.module'
import { AuthModule } from '@/modules/auth/auth.module'
import { SequelizeModule } from '@nestjs/sequelize'
import Token from '@/modules/auth/models/token.model'
import User from '@/modules/user/model/user.model'
import { UserModule } from '@/modules/user/user.module'
import { UserValidationModule } from '@/modules/user/user-validation/user-validation.module'

@Module({
	imports: [
		MailModule,
		forwardRef(() => AuthModule),
		SequelizeModule.forFeature([Token, User]),
		forwardRef(() => UserModule),
		UserValidationModule
	],
	controllers: [MailConfirmController],
	providers: [MailConfirmService],
	exports: [MailConfirmService]
})
export class MailConfirmModule {
}
