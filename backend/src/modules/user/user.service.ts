import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import User from './model/user.model';
import Ads from '../advertisements/model/ads.model';
import { Op, Transaction, WhereOptions } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Role } from '../../common/enums';
import { UserPayload } from '../../strategy/types';
import { ChangePasswordDto } from './dto/change.password.dto';

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
		t?: Transaction,
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

	async createUser(dto: CreateUserDto): Promise<CreateUserDto> { //TODO logs
		const t: Transaction = await this.sequelize.transaction();
		try {
			await this.checkUserDoesNotExist(dto, t);
			dto.password = await bcrypt.hash(dto.password, 12);
			const res = await this.userRepository.create(
				{
					username: dto.username,
					password: dto.password,
					email: dto.email,
					role: Role.USER,
				},
				{ transaction: t },
			);
			await t.commit();
			return res;
		} catch (e) {
			await t.rollback();
			throw e;
		}
	}

	async updateUser(email: string, dto: UpdateUserDto): Promise<UpdateUserDto> {
		const t = await this.sequelize.transaction();
		try {
			const allowedFields = ['username', 'email'];
			const filteredReq: UpdateUserDto = Object.fromEntries(
				Object.entries(dto).filter(([key, value]) => allowedFields.includes(key) && value !== undefined),
			);
			if (filteredReq.email || filteredReq.username) {
				await this.checkUserDoesNotExist(filteredReq, t);
			}
			await this.userRepository.update(filteredReq, { where: { email }, transaction: t });
			await t.commit();
			return this.publicUser(email);
		} catch (e) {
			await t.rollback();
			throw e;
		}
	}

	async changePassword(user: UserPayload, dto: ChangePasswordDto): Promise<boolean> {
		const t = await this.sequelize.transaction();
		try {
			const target = await this.findUserBy({ id: user.id, email: user.email }, t);
			const allowedFields = ['currentPassword', 'newPassword'];
			const filteredReq = Object.fromEntries(
				Object.entries(dto).filter(([key, value]) => allowedFields.includes(key) && value !== undefined),
			);
			await this.checkPassword(filteredReq.currentPassword, target.password, t);
			const hashedPassword = await bcrypt.hash(target.password, 12);
			await this.userRepository.update(
				{ password: hashedPassword },
				{ where: { id: target.id }, transaction: t }
			);
			await t.commit();
			return true;
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
