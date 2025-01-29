import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import User from './model/user.model';
import Ads from '../advertisements/model/ads.model';
import { Op, Transaction, WhereOptions } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Role } from '../../common/enums';

@Injectable()
export class UserService {

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

	async checkUser(
		user: Partial<User>,
		t?: Transaction,
	): Promise<void> {
		const where: WhereOptions<User> = {};
		if (user.email) where.email = user.email;
		if (user.username) where.username = user.username;
		const exist = await this.findUserBy(where, t);
		if (exist) {
			throw new BadRequestException(
				exist.email === user.email
					? 'User with this email already exists'
					: 'User with this username already exists',
			);
		}
	}

	async checkPassword(
		password: string,
		user: Partial<User>,
		): Promise<void> {
		const validPassword = await bcrypt.compare(
			password,
			user.password,
		);
		if (!validPassword) {
			throw new BadRequestException('Wrong password');
		}
	}

	// private async changePassword(
	// 	password: string,
	// 	t?: Transaction,
	// ): Promise<boolean> {
	//
	// } //TODO

	async findUserBy(
		options: WhereOptions<User>,
		t?: Transaction,
	): Promise<User> {
			const where: WhereOptions<User> = Object.keys(options).length > 1
				? { [Op.or]: Object.entries(options).map(([key, value]) => ({ [key]: value })) }
				: options;
			const user = await this.userRepository.findOne({
				where,
				transaction: t,
			});
			if (!user) {
				throw new NotFoundException('User not found');
			}
			return user;
	}

	async createUser(dto: CreateUserDto): Promise<CreateUserDto> {
		const t: Transaction = await this.sequelize.transaction();
		try {
			await this.checkUser(dto, t);
			dto.password = await bcrypt.hash(dto.password, 12);
			await this.userRepository.create(
				{
					username: dto.username,
					password: dto.password,
					email: dto.email,
					role: Role.USER,
				},
				{ transaction: t },
			);
			await t.commit();
			return dto;
		} catch (e) {
			await t.rollback();
			throw e;
		}
	}

	async updateUser(email: string, dto: UpdateUserDto): Promise<UpdateUserDto> {
		const t = await this.sequelize.transaction();
		try {
			if (dto.email || dto.username) {
				await this.checkUser(dto, t);
			}
			const target: UpdateUserDto = Object.fromEntries(
				Object.entries(dto).filter(([_, value]) => value !== undefined)
			);
			await this.userRepository.update(target, { where: { email }, transaction: t});
			await t.commit();
			return this.publicUser(email);
		} catch (e) {
			await t.rollback();
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
