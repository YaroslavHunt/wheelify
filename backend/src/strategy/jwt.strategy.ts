import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import User from '../modules/user/model/user.model';
import { JwtPayload } from './types';
import { UserService } from 'src/modules/user/user.service';
import { ConfigService } from '@nestjs/config';
import { WinstonLoggerService } from '../modules/logger/logger.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly userService: UserService,
		private readonly configService: ConfigService,
		private readonly logger: WinstonLoggerService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get<string>('jwt.secret'),
		});
		this.logger = new WinstonLoggerService(JwtStrategy.name);
		this.logger.log('JWT strategy initialized');
	}

	async validate(payload: JwtPayload): Promise<User> {   // TODO
		this.logger.debug(`Validating JWT payload: ${JSON.stringify(payload)}`);
		const user = await this.userService.findUserBy({ email: payload.user.email });
		if (!user) {
			this.logger.warn(`Unauthorized attempt with email: ${payload.user.email}`);
			throw new UnauthorizedException('Invalid token: user not found');
		}
		this.logger.log(`JWT validated for user: ${payload.user.username}, with email: ${payload.user.email}`);
		return user;
	}
}
