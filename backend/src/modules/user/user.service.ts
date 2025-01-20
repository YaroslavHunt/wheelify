import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import User from './model/user.model';
import Ads from '../advertisements/model/ads.model';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Role } from '../../common/constants';

@Injectable()
export class UserService {
	private readonly logger = new Logger(UserService.name);

	constructor(
		@Inject('USER_REPOSITORY') private readonly userRepository: typeof User,
		private readonly sequelize: Sequelize,
	) {
	}

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
			throw e;
		}
	}

	async hashPassword(password: string): Promise<string> {
		try {
			return bcrypt.hash(password, 10);
		} catch (e) {
			throw e;
		}
	}

	async findUserByEmail(email: string): Promise<User> {
		try {
			return this.userRepository.findOne({ where: { email } });
		} catch (e) {
			throw e;
		}
	}

	async getUsers() {
		try {
			return null;
		} catch (e) {
			throw e;
		}
	}

	async createUser(dto: CreateUserDto): Promise<CreateUserDto> {
		const t: Transaction = await this.sequelize.transaction();
		try {
			const existUser = await this.findUserByEmail(dto.email);
			if (existUser) {
				throw new BadRequestException('User with this email already exists');
			}
			if (dto.role === Role.ADMIN) {
				this.logger.error(`Attempt to create admin user with email ${dto.email}`);
				throw new BadRequestException('Reserved value. Administrator already exists');
			}
			dto.role = dto.role || Role.USER;
			dto.password = await this.hashPassword(dto.password);
			await this.userRepository.create({
					username: dto.username,
					password: dto.password,
					email: dto.email,
					role: dto.role,
				},
				{ transaction: t },
			);
			await t.commit();
			this.logger.log(`Successful register user ${dto.username}, with email ${dto.email}`,);
			return dto;
		} catch (e) {
			await t.rollback();
			this.logger.error(`Failed to register user: ${e.message}`, e.stack);
			throw e;
		}
	}

	async updateUser(email: string, dto: UpdateUserDto): Promise<UpdateUserDto> {
		try {
			await this.userRepository.update(dto, { where: { email } });
			return dto;
		} catch (e) {
			throw e;
		}
	}

	async deleteUser(email: string): Promise<boolean> {
		try {
			await this.userRepository.destroy({ where: { email } });
			return true;
		} catch (e) {
			throw e;
		}
	}
}
