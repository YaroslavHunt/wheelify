import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
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
			await this.usersService.checkUserExists(dto)
			const user = await this.usersService.findUserBy({ email: dto.email });
			await this.usersService.checkPassword(dto.password, user.password);
			const res = await this.usersService.publicUser(dto.email);
			const token = await this.tokenService.generateJwtToken(res);
			return { user: res, token };
		} catch (e) {
			throw e;
		}
	}
}
