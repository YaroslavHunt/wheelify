import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import User from '../modules/user/model/user.model';
import { JwtPayload } from './types';
import { ConfigService } from '@nestjs/config';
import { WinstonLoggerService } from '../modules/logger/logger.service';
import { UserValidService } from '../modules/user/user.validation.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly userValidService: UserValidService,
		private readonly configService: ConfigService,
		private readonly logger: WinstonLoggerService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get<string>('jwt.secret'),
		});
		this.logger.setLabel(JwtStrategy.name)
		this.logger.log('JWT strategy initialized');
	}

	async validate(payload: JwtPayload): Promise<User> {
		this.logger.debug(`Validating JWT payload: ${JSON.stringify(payload)}`);
		const user = await this.userValidService.findUserBy({ id: payload.user.id, email: payload.user.email });
		if (!user) {
			throw new UnauthorizedException('Invalid token: user not found');
		}
		return user;
	}
}
