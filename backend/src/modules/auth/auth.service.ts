import { Injectable } from '@nestjs/common';
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

	async registerUser(dto: CreateUserDto): Promise<CreateUserDto> {
		try {
			const existUser = await this.usersService.findUserByEmail(dto.email);
			if (!existUser) {
				return this.usersService.createUser(dto);
			} else {
				console.error('User with this email already exist.');
			}
		} catch (e) {
			throw new Error(e);
		}
	}

	async loginUser(dto: UserLoginDto): Promise<AuthUserResponse> {
		try {
			const existUser = await this.usersService.findUserByEmail(dto.email);
			if (!existUser) console.error('User with this email does not exist.');
			const validPassword = await bcrypt.compare(dto.password, existUser.password);
			if (!validPassword) console.error('Wrong password.');
			const user = await this.usersService.publicUser(dto.email);
			const token = await this.tokenService.generateJwtToken(user);
			return { user, token };
		} catch (e) {
			throw new Error(e);
		}
	}
}