import { forwardRef, Module } from '@nestjs/common'
import { MailConfirmService } from './mail-confirm.service'
import { MailConfirmController } from './mail-confirm.controller'
import { MailModule } from '@/libs/mail/mail.module'
import { AuthModule } from '@/modules/auth/auth.module'
import { SequelizeModule } from '@nestjs/sequelize'
import Token from '@/modules/token/model/token.model'
import User from '@/modules/user/model/user.model'
import { UserService } from '@/modules/user/user.service'
import { MailService } from '@/libs/mail/mail.service'
import { UserValidService } from '@/modules/user/user-validation.service'

@Module({
	imports: [
		MailModule,
		MailModule, forwardRef(() => AuthModule),
		SequelizeModule.forFeature([Token, User])
	],
	controllers: [MailConfirmController],
	providers: [MailConfirmService, UserService, UserValidService, MailService],
	exports: [MailConfirmService]
})
export class MailConfirmModule {
}
