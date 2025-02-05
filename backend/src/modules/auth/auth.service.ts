import { Injectable } from '@nestjs/common';
import { TokenService } from '../token/token.service';
import { CreateUserDto } from '../user/dto/create.user.dto';
import { UserLoginDto } from '../user/dto/user.login.dto';
import { AuthUserResponse } from '../user/dto/user.dto';
import { UserValidService } from '../user/user.validation.service';
import { WinstonLoggerService } from '../logger/logger.service';
import User from '../user/model/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { TransactionHelper } from '../../common/transaction.helper';
import * as bcrypt from 'bcrypt';
import { Role } from '../../common/enums';

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

	async registerUser(dto: CreateUserDto): Promise<CreateUserDto> {
		return this.transaction.run(async (t) => {
			await this.userValidService.checkUserDoesNotExist(dto, t);
			dto.password = await bcrypt.hash(dto.password, 12);
			const res = await this.userRepository.create(
				{
					username: dto.username,
					password: dto.password,
					email: dto.email,
					role: Role.USER,
				},
				{ transaction: t },
			);
			this.logger.log('Successfully create new user');
			return res;
		});
	}

	async logIn(dto: UserLoginDto): Promise<AuthUserResponse> {
		try {
			await this.userValidService.checkUserExists(dto);
			const user = await this.userRepository.findOne({ where:{ email: dto.email }});
			await this.userValidService.checkPassword(dto.password, user.password);
			const res = await this.userValidService.publicUser(dto.email);
			const token = await this.tokenService.generateJwtToken(res);
			return { user: res, token };
		} catch (e) {
			throw e;
		}
	}
}
