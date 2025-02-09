import { Injectable } from '@nestjs/common';
import { TokenService } from '../token/token.service';
import { CreateUserReq } from '../user/dto/req/create.user.req';
import { UserLoginReq } from '../user/dto/req/user.login.req';
import { UserRes } from '../user/dto/res/user.res';
import { UserValidService } from '../user/user.validation.service';
import { WinstonLoggerService } from '../logger/logger.service';
import User from '../user/model/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { TransactionHelper } from '../../database/sequelize/transaction.helper';
import * as bcrypt from 'bcrypt';
import { Role } from '../../common/enums';
import { AuthResponse } from '../user/dto/res/auth.res';
import { toDTO } from '../../common/utils/mapper';

@Injectable()
export class AuthService {

	constructor(
		@InjectModel(User) private readonly userRepository: typeof User,
		private readonly userValidService: UserValidService,
		private readonly tokenService: TokenService,
		private readonly transaction: TransactionHelper,
		private readonly logger: WinstonLoggerService,
	) {
		this.logger.setLabel(AuthService.name);
	}

	async registerUser(dto: CreateUserReq): Promise<UserRes> {
		return this.transaction.run(async (t) => {
			await this.userValidService.checkUserDoesNotExist(dto, t);
			dto.password = await bcrypt.hash(dto.password, 12);
			const user = await this.userRepository.create(
				{
					username: dto.username,
					password: dto.password,
					email: dto.email,
					role: Role.USER,
				},
				{ transaction: t },
			);
			this.logger.log('Successfully create new user');
			return toDTO(UserRes, user);
		});
	}

	async logIn(dto: UserLoginReq): Promise<AuthResponse> {
		try {
			await this.userValidService.checkUserExists(dto);
			const user = await this.userRepository.findOne({ where:{ email: dto.email }});
			await this.userValidService.checkPassword(dto.password, user.password);
			const res = toDTO(UserRes, user);
			const token = await this.tokenService.generateJwtToken(res);
			return { user: res, token };
		} catch (e) {
			throw e;
		}
	}
}
