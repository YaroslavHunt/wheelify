import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse } from '@nestjs/swagger';
import { CreateUserReq } from '../user/dto/req/create.user.req';
import { UserRes } from '../user/dto/res/user.res';
import { UserLoginReq } from '../user/dto/req/user.login.req';
import { AuthResponse } from '../user/dto/res/auth.res';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiResponse({ status: 201, type: UserRes })
	@HttpCode(201)
	@Post('sign-up')
	register(@Body() dto: CreateUserReq): Promise<UserRes> {
		return this.authService.registerUser(dto);
	}

	@ApiResponse({ status: 200, type: AuthResponse })
	@HttpCode(200)
	@Post('sign-in')
	login(@Body() dto: UserLoginReq): Promise<AuthResponse> {
		return this.authService.logIn(dto);
	}
}
