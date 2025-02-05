import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from '../user/dto/create.user.dto';
import { AuthUserResponse } from '../user/dto/user.dto';
import { UserLoginDto } from '../user/dto/user.login.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiResponse({ status: 201, type: CreateUserDto })
	@HttpCode(201)
	@Post('sign-up')
	register(@Body() dto: CreateUserDto): Promise<CreateUserDto> {
		return this.authService.registerUser(dto);
	}

	@ApiResponse({ status: 200, type: AuthUserResponse })
	@HttpCode(200)
	@Post('sign-in')
	login(@Body() dto: UserLoginDto): Promise<AuthUserResponse> {
		return this.authService.logIn(dto);
	}
}
