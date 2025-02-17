import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Get,
	Req,
	Res,
	UseInterceptors,
	Param,
	Query, BadRequestException
} from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { UserLoginReqDTO } from './dto/req/user-login-req.dto'
import { LoginResDTO } from './dto/res/login-res.dto'
import { Request, Response } from 'express'

import { AuthService } from './auth.service'
import { RegisterUserReqDTO } from '@/modules/auth/dto/req/register-user-req.dto'
import { RegisterUserResDTO } from '@/modules/auth/dto/res/register-user-res.dto'
import { Recaptcha } from '@nestlab/google-recaptcha'
import { AuthProvider } from '@/decorators/auth-provider.decorator'
import { ProviderService } from '@/modules/auth/providers/provider.service'
import { ConfigService } from '@nestjs/config'
import { AppEnv } from '@/config/enums'

@Controller('auth')
export class AuthController {
	public constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService,
		private readonly providerService: ProviderService,
		) {
	}

	@Recaptcha()
	@UseInterceptors()
	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	@ApiResponse({ status: HttpStatus.CREATED, type: RegisterUserResDTO })
	public async register(@Req() req: Request, @Body() data: RegisterUserReqDTO) {
		return this.authService.register(req, data)
	}

	@Recaptcha()
	@Post('login')
	@HttpCode(HttpStatus.OK)
	@ApiResponse({ status: HttpStatus.OK, type: LoginResDTO })
	public async login(@Req() req: Request, @Body() data: UserLoginReqDTO) {
		return this.authService.login(req, data)
	}

	@AuthProvider()
	@Get('/oauth/callback/:provider')
	public async callback(
		@Req() req: Request,
		@Res({ passthrough: true }) res : Response,
		@Query('code') code: string,
		@Param('provider') provider : string,
	) {
		if(!code) {
			throw new BadRequestException('Authorization code was not presented')
		}
		await this.authService.extractProfileFromCode(req, provider, code)
		return res.redirect(`${this.configService.getOrThrow<string>(AppEnv.CLIENT)}/dashboard/settings`) // TODO client path
	}

	@AuthProvider()
	@Get('/oauth/connect/:provider')
	@HttpCode(HttpStatus.OK)
	@ApiResponse({ status: HttpStatus.OK })
	public async connect(@Param('provider') provider: string) {
		const providerInstance = this.providerService.findByService(provider)
		return { url: providerInstance.getAuthUrl() }
	}

	@Post('logout')
	@HttpCode(HttpStatus.OK)
	@ApiResponse({ status: HttpStatus.OK })
	public async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		return this.authService.logout(req, res)
	}

}


