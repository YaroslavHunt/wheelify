import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Param,
	Post
} from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { Recaptcha } from '@nestlab/google-recaptcha'

import { NewPasswordDTO } from '@/modules/auth/password-recovery/dto/new-password.dto'
import { ResetPasswordDTO } from '@/modules/auth/password-recovery/dto/reset-password.dto'

import { PasswordRecoveryService } from './password-recovery.service'

@Controller('auth/password-recovery')
export class PasswordRecoveryController {
	constructor(
		private readonly passwordRecoveryService: PasswordRecoveryService
	) {}

	@Post('reset')
	@HttpCode(HttpStatus.OK)
	@ApiResponse({ status: HttpStatus.OK })
	public async reset(@Body() data: ResetPasswordDTO) {
		return this.passwordRecoveryService.resetPassword(data)
	}

	@Post('new/:token')
	@HttpCode(HttpStatus.OK)
	@ApiResponse({ status: HttpStatus.OK })
	public async new(
		@Body() data: NewPasswordDTO,
		@Param('token') token: string
	) {
		return this.passwordRecoveryService.newPassword(data, token)
	}
}
