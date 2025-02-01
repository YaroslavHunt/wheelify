import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import User from './model/user.model';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Role } from '../../common/enums';
import { UserPayload } from '../../strategy/types';
import { ChangePasswordDto } from './dto/change.password.dto';
import { UserValidationService } from './user.validation.service';
import { WinstonLoggerService } from '../logger/logger.service';

@Injectable()
export class UserService {

	constructor(
		@Inject('USER_REPOSITORY') private readonly userRepository: typeof User,
		private readonly userValidService: UserValidationService,
		private readonly sequelize: Sequelize,
		private readonly logger: WinstonLoggerService,
	) {
		this.logger.setLabel(UserService.name);
	}

	async createUser(dto: CreateUserDto): Promise<CreateUserDto> {
		const t: Transaction = await this.sequelize.transaction();
		try {
			await this.userValidService.checkUserDoesNotExist(dto, t);
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
			this.logger.log('Successfully create new user');
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
				await this.userValidService.checkUserDoesNotExist(filteredReq, t);
			}
			await this.userRepository.update(filteredReq, { where: { email }, transaction: t });
			await t.commit();
			return this.userValidService.publicUser(email);
		} catch (e) {
			await t.rollback();
			throw e;
		}
	}

	async changePassword(user: UserPayload, dto: ChangePasswordDto): Promise<boolean> {
		const t = await this.sequelize.transaction();
		try {
			const target = await this.userValidService.findUserBy({ id: user.id, email: user.email }, t);
			const allowedFields = ['currentPassword', 'newPassword'];
			const filteredReq = Object.fromEntries(
				Object.entries(dto).filter(([key, value]) => allowedFields.includes(key) && value !== undefined),
			);
			await this.userValidService.checkPassword(filteredReq.currentPassword, target.password);
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
			this.logger.log('User deleted');
			return true;
		} catch (e) {
			throw e;
		}
	}
}
