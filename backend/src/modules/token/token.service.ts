import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

import { JwtPayload } from '../../strategy/types'

@Injectable()
export class TokenService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService
	) {}

	async generateJwtToken(user: JwtPayload): Promise<string> {
		return this.jwtService.signAsync(
			{ ...user },
			{
				secret: this.configService.get('jwt.secret'),
				expiresIn: this.configService.get('jwt.expire')
			}
		)
	}
}
