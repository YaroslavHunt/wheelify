import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {
	}

	async generateJwtToken(user: Object): Promise<string> {
		const payload = { user };

		return this.jwtService.signAsync(payload, {
			secret: this.configService.get('jwt.secret'),
			expiresIn: this.configService.get('jwt.expire'),
		});
	}
}