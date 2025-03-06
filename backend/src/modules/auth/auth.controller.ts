import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	Res
} from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { Request, Response } from 'express'

import { RegisterUserReqDTO } from '@/modules/auth/dto/req/register-user-req.dto'
import User from '@/modules/user/model/user.model'

import { AuthService } from './auth.service'
import { UserLoginReqDTO } from './dto/req/user-login-req.dto'

@Controller('auth')
export class AuthController {
	public constructor(private readonly authService: AuthService) {}

	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	@ApiResponse({ status: HttpStatus.CREATED })
	public async register(@Body() data: RegisterUserReqDTO) {
		return this.authService.register(data)
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	@ApiResponse({ status: HttpStatus.OK, type: User })
	public async login(@Req() req: Request, @Body() data: UserLoginReqDTO) {
		const res = await this.authService.login(req, data)
		if (!(res instanceof User) && res?.message) {
			return { requires2FA: true, message: res.message }
		}
		return res
	}

	@Post('logout')
	@HttpCode(HttpStatus.OK)
	@ApiResponse({ status: HttpStatus.OK })
	public async logout(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response
	) {
		return this.authService.logout(req, res)
	}
}
