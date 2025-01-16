import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { TokenService } from '../token/token.service';
import { CreateUserDto } from '../user/dto/create.user.dto';
import { UserLoginDto } from './dto/user.login.dto';
import { AuthUserResponse } from './response/user.response';
import { Role } from 'src/common/enums';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UserService,
		private readonly tokenService: TokenService,
		private readonly logger: Logger,
	) {}

	async signUp(dto: CreateUserDto): Promise<CreateUserDto> {
		const existUser = await this.usersService.findUserByEmail(dto.email);
		if (existUser) {
			throw new BadRequestException('User with this email already exists');
		}
		if (dto.role === Role.ADMIN) {
			throw new BadRequestException(
				'Reserved value. Administrator already exists',
			);
		}
		dto.role = dto.role ?? Role.USER;
		this.logger.log(
			`Registering user ${dto.username}, with email ${dto.email}`,
		);
		return await this.usersService.createUser(dto);
	}

	async signIn(dto: UserLoginDto): Promise<AuthUserResponse> {
		const existUser = await this.usersService.findUserByEmail(dto.email);
		if (!existUser) {
			throw new BadRequestException(
				`User with email ${dto.email} does not exist`,
			);
		}
		const validPassword = await bcrypt.compare(
			dto.password,
			existUser.password,
		);
		if (!validPassword) {
			throw new BadRequestException('Wrong password');
		}
		const user = await this.usersService.publicUser(dto.email);
		const token = await this.tokenService.generateJwtToken(user);
		return { user, token };
	}
}
