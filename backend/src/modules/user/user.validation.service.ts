import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import User from './model/user.model';
import Ads from '../advertisements/model/ads.model';
import { Op, Transaction, WhereOptions } from 'sequelize';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserValidationService {

	constructor(
		@Inject('USER_REPOSITORY') private readonly userRepository: typeof User,
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

	async checkUserDoesNotExist(
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

	async checkUserExists(
		user: Partial<User>,
		t?: Transaction,
	): Promise<void> {
		const where: WhereOptions<User> = {};
		if (user.email) where.email = user.email;
		if (user.username) where.username = user.username;
		const exist = await this.findUserBy(where, t);
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

	async findUserBy(
		options: WhereOptions<User>,
		t?: Transaction,
	): Promise<User> {
		const where: WhereOptions<User> = Object.keys(options).length > 1
			? { [Op.or]: Object.entries(options).map(([key, value]) => ({ [key]: value })) }
			: options;
		return await this.userRepository.findOne({ where, transaction: t });
	}
}