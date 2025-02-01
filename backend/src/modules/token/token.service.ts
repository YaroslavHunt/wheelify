import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserLoginDto } from '../auth/dto/user.login.dto';

@Injectable()
export class TokenService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {
	}

	async generateJwtToken(user: UserLoginDto): Promise<string> {
		try {
			const payload = { user };
			return this.jwtService.signAsync(payload, {
				secret: this.configService.get('jwt.secret'),
				expiresIn: this.configService.get('jwt.expire'),
			});
		} catch (e) {
			throw e;
		}
	}
}
