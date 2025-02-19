import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common'
import { MailConfirmService } from './mail-confirm.service';
import { Request } from 'express'
import { ConfirmationDTO } from '@/modules/auth/mail-confirm/dto/confirmation.dto'

@Controller('auth/mail-confirmation')
export class MailConfirmController {
  constructor(private readonly mailConfirmService: MailConfirmService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  public async newVerification(
      @Req() req: Request,
      @Body() data: ConfirmationDTO ) {
      return this.mailConfirmService.newVerification(req, data)
  }
}
