import { Module } from '@nestjs/common'
import { TwoFactorAuthService } from './two-factor-auth.service'
import { MailModule } from '@/libs/mail/mail.module'
import Token from '@/modules/auth/models/token.model'
import { SequelizeModule } from '@nestjs/sequelize'

@Module({
	imports: [
		SequelizeModule.forFeature([Token]),
		MailModule
	],
	providers: [TwoFactorAuthService],
	exports: [TwoFactorAuthService],
})
export class TwoFactorAuthModule {}
