import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import User from './models/user.model';
import Ads from '../watchlist/models/ads.model';

@Injectable()
export class UserService {
	constructor(
		@Inject('USER_REPOSITORY') private readonly userRepository: typeof User,
	) {}

	async publicUser(email: string): Promise<User> {
		try {
			return this.userRepository.findOne({
				where: { email },
				attributes: { exclude: ['password'] },
				include: {
					model: Ads,
					required: false,
				},
			});
		} catch (e) {
			throw new Error(e);
		}
	}

	async hashPassword(password: string): Promise<string> {
		try {
			return bcrypt.hash(password, 10);
		} catch (e) {
			throw new Error(e);
		}
	}

	async findUserByEmail(email: string): Promise<User> {
		try {
			return this.userRepository.findOne({ where: { email } });
		} catch (e) {
			throw new Error(e);
		}
	}

	async getUsers() {
		try {
			return null;
		} catch (e) {
			throw new Error(e);
		}
	}

	async createUser(dto: CreateUserDto): Promise<CreateUserDto> {
		try {
			dto.password = await this.hashPassword(dto.password);
			await this.userRepository.create({
				username: dto.username,
				password: dto.password,
				email: dto.email,
				role: dto.role,
			});
			return dto;
		} catch (e) {
			throw new Error(e);
		}
	}

	async updateUser(email: string, dto: UpdateUserDto): Promise<UpdateUserDto> {
		try {
			await this.userRepository.update(dto, { where: { email } });
			return dto;
		} catch (e) {
			throw new Error(e);
		}
	}

	async deleteUser(email: string): Promise<boolean> {
		try {
			await this.userRepository.destroy({ where: { email } });
			return true;
		} catch (e) {
			throw new Error(e);
		}
	}
}
