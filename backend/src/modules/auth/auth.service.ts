import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import { CreateUserDto } from '../user/dto/create.user.dto';
import { UserLoginDto } from './dto/user.login.dto';
import { AuthUserResponse } from './response/user.response';
import { UserValidationService } from '../user/user.validation.service';

@Injectable()
export class AuthService {

	constructor(
		private readonly usersService: UserService,
		private readonly userValidService: UserValidationService,
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
			await this.userValidService.checkUserExists(dto)
			const user = await this.userValidService.findUserBy({ email: dto.email });
			await this.userValidService.checkPassword(dto.password, user.password);
			const res = await this.userValidService.publicUser(dto.email);
			const token = await this.tokenService.generateJwtToken(res);
			return { user: res, token };
		} catch (e) {
			throw e;
		}
	}
}
