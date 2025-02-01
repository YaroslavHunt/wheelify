import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import User from '../modules/user/model/user.model';
import { JwtPayload } from './types';
import { ConfigService } from '@nestjs/config';
import { WinstonLoggerService } from '../modules/logger/logger.service';
import { UserValidationService } from '../modules/user/user.validation.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly userValidService: UserValidationService,
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

	async validate(payload: JwtPayload): Promise<User> {   // TODO
		this.logger.debug(`Validating JWT payload: ${JSON.stringify(payload)}`);
		const user = await this.userValidService.findUserBy({ email: payload.user.email });
		if (!user) {
			this.logger.warn(`Unauthorized attempt with email: ${payload.user.email}`);
			throw new UnauthorizedException('Invalid token: user not found');
		}
		return user;
	}
}
