import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import User from './model/user.model';
import { Op, Transaction, WhereOptions } from 'sequelize';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UserValidService {

	constructor(
		@InjectModel(User) private readonly userRepository: typeof User,
	) {
	}

	private async findUserByConditions(
		options: WhereOptions<User>,
		t?: Transaction,
	): Promise<User> {
		const where = Object.keys(options).length > 1
			? { [Op.or]: Object.entries(options).map(([key, value]) => ({ [key]: value })) }
			: options;
		return await this.userRepository.findOne({ where, transaction: t });
	}

	async checkUserDoesNotExist(
		user: Partial<User>,
		t?: Transaction,
	): Promise<void> {
		const where: WhereOptions<User> = {};
		if (user.email) where.email = user.email;
		if (user.username) where.username = user.username;
		const exist = await this.findUserByConditions(where, t);
		if (exist) {
			throw new BadRequestException(
				exist.email === user.email
					? 'User with this email already exists'
					: 'User with this username already exists',
			);
		}
	}

	async checkUserExists(
		user: Partial<User>,
		t?: Transaction,
	): Promise<void> {
		const where: WhereOptions<User> = {};
		if (user.email) where.email = user.email;
		if (user.username) where.username = user.username;
		const exist = await this.findUserByConditions(where, t);
		if (!exist) {
			throw new NotFoundException('User not found');
		}
	}

	async checkPassword(
		entryPassword: string,
		userPassword: string,
	): Promise<void> {
		const validPassword = await bcrypt.compare(
			entryPassword,
			userPassword,
		);
		if (!validPassword) {
			throw new BadRequestException('Wrong password');
		}
	}
}