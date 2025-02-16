import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UseInterceptors } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { UserLoginReqDTO } from './dto/req/user-login-req.dto'
import { LoginResDTO } from './dto/res/login-res.dto'
import { Request, Response } from 'express'

import { AuthService } from './auth.service'
import { RegisterUserReqDTO } from '@/modules/auth/dto/req/register-user-req.dto'
import { RegisterUserResDTO } from '@/modules/auth/dto/res/register-user-res.dto'

@Controller('auth')
export class AuthController {
	public constructor(private readonly authService: AuthService) {
	}

	@Post('register')
	@ApiResponse({ status: HttpStatus.CREATED, type: RegisterUserResDTO })
	@HttpCode(HttpStatus.CREATED)
	@UseInterceptors()
	register(@Req() req: Request, @Body() data: RegisterUserReqDTO) {
		return this.authService.register(req, data)
	}

	@ApiResponse({ status: HttpStatus.OK, type: LoginResDTO })
	@HttpCode(HttpStatus.OK)
	@Post('login')
	login(@Req() req: Request, @Body() data: UserLoginReqDTO) {
		return this.authService.login(req, data)
	}

	@ApiResponse({ status: HttpStatus.OK })
	@HttpCode(HttpStatus.OK)
	@Post('logout')
	logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		return this.authService.logout(req, res)
	}

}


