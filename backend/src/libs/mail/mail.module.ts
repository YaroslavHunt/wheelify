import { MailerModule } from '@nestjs-modules/mailer'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { getMailerConfig } from '@/config/mailer/mailer.config'

import { MailService } from './mail.service'

@Module({
	imports: [
		MailerModule.forRootAsync({
			useFactory: getMailerConfig,
			inject: [ConfigService]
		})
	],
	providers: [MailService],
	exports: [MailService]
})
export class MailModule {}
