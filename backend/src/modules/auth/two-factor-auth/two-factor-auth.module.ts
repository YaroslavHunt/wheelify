import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { MailModule } from '@/libs/mail/mail.module'
import Token from '@/modules/auth/models/token.model'

import { TwoFactorAuthService } from './two-factor-auth.service'

@Module({
	imports: [SequelizeModule.forFeature([Token]), MailModule],
	providers: [TwoFactorAuthService],
	exports: [TwoFactorAuthService]
})
export class TwoFactorAuthModule {}
