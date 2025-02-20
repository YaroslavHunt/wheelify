import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Query,
	Req,
	Res,
	UseInterceptors
} from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { UserLoginReqDTO } from './dto/req/user-login-req.dto'
import { Request, Response } from 'express'

import { AuthService } from './auth.service'
import { RegisterUserReqDTO } from '@/modules/auth/dto/req/register-user-req.dto'
import { Recaptcha } from '@nestlab/google-recaptcha'
import { AuthProvider } from '@/modules/auth/decorators/auth-provider.decorator'
import { ProviderService } from '@/modules/auth/providers/provider.service'
import { ConfigService } from '@nestjs/config'
import { AppEnv } from '@/config/enums'
import { toDTO } from '@/database/sequelize/utils/mapper.util'
import { UserProfileDTO } from '@/modules/user/dto/res/user-profile.dto'

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
	@ApiResponse({ status: HttpStatus.CREATED })
	public async register(@Req() req: Request, @Body() data: RegisterUserReqDTO) {
		return this.authService.register(req, data)
	}

	@Recaptcha()
	@Post('login')
	@HttpCode(HttpStatus.OK)
	@ApiResponse({ status: HttpStatus.OK, type: UserProfileDTO })
	public async login(@Req() req: Request, @Body() data: UserLoginReqDTO) {
		const res = await this.authService.login(req, data)
		return await toDTO(UserProfileDTO, res)
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


