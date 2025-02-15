import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { InjectModel } from '@nestjs/sequelize'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { toDTO } from '@/database/sequelize/utils/mapper.util'
import { WinstonLoggerService } from '@/logger/logger.service'
import { RegisterUserResDTO } from '@/modules/auth/dto/res/register-user-res.dto'
import User from '../modules/user/model/user.model'

import { JwtPayload } from './types'
import { JwtEnv } from '@/config/enums'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		@InjectModel(User) private readonly userRepository: typeof User,
		private readonly config: ConfigService,
		private readonly logger: WinstonLoggerService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: config.get<string>(JwtEnv.SECRET)
		})
		this.logger.log('JWT strategy initialized')
	}

	async validate(payload: JwtPayload): Promise<RegisterUserResDTO> {
		this.logger.debug(`Validating JWT payload: ${JSON.stringify(payload)}`)
		const user = await this.userRepository.findOne({
			where: { id: payload.id }
		})
		if (!user) {
			throw new UnauthorizedException('Invalid token: user not found')
		}
		return toDTO(RegisterUserResDTO, user) //TODO refresh access
	}
}
