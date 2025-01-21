import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { TokenService } from '../token/token.service';
import { CreateUserDto } from '../user/dto/create.user.dto';
import { UserLoginDto } from './dto/user.login.dto';
import { AuthUserResponse } from './response/user.response';

@Injectable()
export class AuthService {

	constructor(
		private readonly usersService: UserService,
		private readonly tokenService: TokenService,
	) {
	}

	async signUp(dto: CreateUserDto): Promise<CreateUserDto> {
		try {
			return await this.usersService.createUser(dto);
		} catch (e) {
			throw e;
		}
	}

	async signIn(dto: UserLoginDto): Promise<AuthUserResponse> {
		try {
			const exist = await this.usersService.findUserBy({ email: dto.email });
			if (!exist) {
				throw new BadRequestException(
					`User with email ${dto.email} does not exist`,
				);
			}
			const validPassword = await bcrypt.compare(
				dto.password,
				exist.password,
			);
			if (!validPassword) {
				throw new BadRequestException('Wrong password');
			}
			const user = await this.usersService.publicUser(dto.email);
			const token = await this.tokenService.generateJwtToken(user);
			return { user, token };
		} catch (e) {
			throw e;
		}
	}
}
