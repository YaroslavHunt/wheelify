import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import User from '../modules/user/model/user.model';
import { JwtPayload } from './types';
import { ConfigService } from '@nestjs/config';
import { WinstonLoggerService } from '../modules/logger/logger.service';
import { UserValidService } from '../modules/user/user.validation.service';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		@InjectModel(User) private readonly userRepository: typeof User,
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
		const user = await this.userRepository.findOne({ where : { id: payload.user.id }});
		if (!user) {
			throw new UnauthorizedException('Invalid token: user not found');
		}
		return user;
	}
}
