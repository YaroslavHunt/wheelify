import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import User from './model/user.model';
import Ads from '../advertisements/model/ads.model';
import { Op, Transaction, WhereOptions } from 'sequelize';
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

	async findUserBy(
		options: WhereOptions<User>,
		t?: Transaction,
	): Promise<User | null> {
		try {
			const where: WhereOptions<User> = Object.keys(options).length > 1
				? { [Op.or]: Object.entries(options).map(([key, value]) => ({ [key]: value })) }
				: options;

			return await this.userRepository.findOne({
				where,
				transaction: t,
			});
		} catch (e) {
			throw e;
		}
	}

	async createUser(dto: CreateUserDto): Promise<CreateUserDto> {
		const t: Transaction = await this.sequelize.transaction();
		try {
			const exist = await this.findUserBy({
				email: dto.email,
				username: dto.username
			}, t);
			if (exist) {
				throw new BadRequestException(
					exist.email === dto.email
						? 'User with this email already exists'
						: 'User with this username already exists',
				);
			}
			if (dto.role === Role.ADMIN) {
				this.logger.error(`Attempt to create admin user with email ${dto.email}`);
				throw new BadRequestException('Reserved value. Administrator already exists');
			}
			dto.role = dto.role || Role.USER;
			dto.password = await bcrypt.hash(dto.password, 12);
			await this.userRepository.create({
					username: dto.username,
					password: dto.password,
					email: dto.email,
					role: dto.role,
				},
				{ transaction: t },
			);
			await t.commit();
			this.logger.log(`Successful register user ${dto.username}, with email ${dto.email}`);
			return dto;
		} catch (e) {
			await t.rollback();
			this.logger.error(`Failed to register user: ${e.message}`, e.stack);
			throw e;
		}
	}

	async updateUser(email: string, dto: UpdateUserDto): Promise<UpdateUserDto> {
		const t = await this.sequelize.transaction();
		try {
			const user = await this.findUserBy({ email }, t);
			const options: WhereOptions<User> = {};
			if (dto.email) options.email = dto.email;
			if (dto.username) options.username = dto.username;
			const exist = await this.findUserBy(options, t);
			if (exist) {
				throw new BadRequestException(
					exist.email === dto.email
						? 'User with this email already exists'
						: 'User with this username already exists',
				);
			}
			if (dto.role === Role.ADMIN) {
				this.logger.error(`Attempt to create admin user with email ${email}`);
				throw new BadRequestException('Reserved value. Administrator already exists');
			}
			dto.role = dto.role || Role.USER;
			dto.password = await bcrypt.hash(dto.password, 12);
			await this.userRepository.update(dto, { where: { email }, transaction: t });
			await t.commit();
			this.logger.log(`Successful update user ${user.username} with id:${user.id}`);
			return this.publicUser(dto.email ?? email);
		} catch (e) {
			await t.rollback();
			this.logger.error(`Failed to update user: ${e.message}`, e.stack);
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
