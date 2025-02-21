import { Module } from '@nestjs/common'
import { MailService } from './mail.service'
import { MailerModule} from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'
import { getMailerConfig } from '@/config/configurations/mailer.config'

@Module({
  imports: [MailerModule.forRootAsync({
    useFactory: getMailerConfig,
    inject: [ConfigService]
  })],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
