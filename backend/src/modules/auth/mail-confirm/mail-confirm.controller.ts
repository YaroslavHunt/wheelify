import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common'
import { MailConfirmService } from './mail-confirm.service';
import { Request } from 'express'
import { ConfirmationDTO } from '@/modules/auth/mail-confirm/dto/confirmation.dto'
import { ApiResponse } from '@nestjs/swagger'
import { toDTO } from '@/database/sequelize/utils/mapper.util'
import { UserLoginReqDTO } from '@/modules/auth/dto/req/user-login-req.dto'
import { RegisterUserResDTO } from '@/modules/auth/dto/res/register-user-res.dto'

@Controller('auth/email-confirmation')
export class MailConfirmController {
  constructor(private readonly mailConfirmService: MailConfirmService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK })
  public async newVerification(
      @Req() req: Request,
      @Body() data: ConfirmationDTO ) {
      const res = await this.mailConfirmService.newVerification(req, data)
      return await toDTO(RegisterUserResDTO, res)
  }
}
