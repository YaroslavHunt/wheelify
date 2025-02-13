import { Body, Controller, Header, HttpCode, HttpStatus, Post, Req } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { UserLoginReqDTO } from './dto/req/user-login-req.dto'
import { AuthResponse } from './dto/res/auth-res'
import { Request } from 'express'

import { AuthService } from './auth.service'
import { RegisterUserReqDTO } from '@/modules/auth/dto/req/register-user-req.dto'
import { RegisterUserResDTO } from '@/modules/auth/dto/res/register-user-res.dto'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {
	}

	@Post('sign-up')
	@ApiResponse({ status: HttpStatus.CREATED, type: RegisterUserResDTO })
	@HttpCode(HttpStatus.CREATED)
	@Header('Content-Type', 'application/json')
	register(@Req() req: Request, @Body() data: RegisterUserReqDTO) {
		return this.authService.register(req, data)
	}

	@ApiResponse({ status: HttpStatus.OK, type: AuthResponse })
	@HttpCode(HttpStatus.OK)
	@Post('sign-in')
	login(@Body() data: UserLoginReqDTO) {
		return this.authService.login(data)
	}
}


