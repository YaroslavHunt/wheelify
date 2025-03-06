import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Req
} from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { Request } from 'express'

import { ConfirmationDTO } from '@/modules/auth/mail-confirm/dto/confirmation.dto'

import { MailConfirmService } from './mail-confirm.service'

@Controller('auth/email-confirmation')
export class MailConfirmController {
	constructor(private readonly mailConfirmService: MailConfirmService) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	@ApiResponse({ status: HttpStatus.OK })
	public async newVerification(
		@Req() req: Request,
		@Body() data: ConfirmationDTO
	) {
		return await this.mailConfirmService.newVerification(req, data)
	}
}
