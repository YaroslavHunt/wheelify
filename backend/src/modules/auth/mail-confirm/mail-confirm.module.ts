import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { MailModule } from '@/libs/mail/mail.module'
import { AuthModule } from '@/modules/auth/auth.module'
import Token from '@/modules/auth/models/token.model'
import User from '@/modules/user/model/user.model'
import { UserModule } from '@/modules/user/user.module'

import { MailConfirmController } from './mail-confirm.controller'
import { MailConfirmService } from './mail-confirm.service'

@Module({
	imports: [
		MailModule,
		forwardRef(() => AuthModule),
		SequelizeModule.forFeature([Token, User]),
		forwardRef(() => UserModule)
	],
	controllers: [MailConfirmController],
	providers: [MailConfirmService],
	exports: [MailConfirmService]
})
export class MailConfirmModule {}
