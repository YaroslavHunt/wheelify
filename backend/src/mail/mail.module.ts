import { Module } from '@nestjs/common'
import { MailService } from './mail.service'
import { MailerModule} from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'

@Module({
  // imports: [MailerModule.forRootAsync({
  //   imports: [ConfigService],
  //   useFactory: getMailerConfig,
  //   inject: [ConfigService]
  // })],
  providers: [MailService],
})
export class MailModule {}
