import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import User from '../modules/user/models/user.model';
import { JwtPayload } from './types';
import { UserService } from 'src/modules/user/user.service';
import * as process from 'node:process';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly userService: UserService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET,
		});
	}

	async validate(payload: JwtPayload): Promise<User> {
		const user = await this.userService.findUserByEmail(payload.user.email);
		if (!user) {
			throw new UnauthorizedException();
		}
		return user;
	}
}