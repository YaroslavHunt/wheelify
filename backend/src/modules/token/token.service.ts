import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { WinstonLoggerService } from '../logger/logger.service';
import { UserLoginDto } from '../auth/dto/user.login.dto';

@Injectable()
export class TokenService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		private readonly logger: WinstonLoggerService,
	) {
		this.logger = new WinstonLoggerService(TokenService.name);
	}

	async generateJwtToken(user: UserLoginDto): Promise<string> {
		try {
			const payload = { user };

			return this.jwtService.signAsync(payload, {
				secret: this.configService.get('jwt.secret'),
				expiresIn: this.configService.get('jwt.expire'),
			});
		} catch (e) {
			if (!(e instanceof Error)) {
				e = new Error(String(e));
			}
			this.logger.error(
				`When try to generate JWT token for user with email : ${user.email}`,
				e.stack,
				TokenService.name);
			throw e;
		}
	}
}
