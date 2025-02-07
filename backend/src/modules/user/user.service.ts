import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UpdateUserReq } from './dto/req/update.user.req';
import User from './model/user.model';
import { UserPayload } from '../../strategy/types';
import { ChangePasswordReq } from './dto/req/change.password.req';
import { UserValidService } from './user.validation.service';
import { WinstonLoggerService } from '../logger/logger.service';
import { InjectModel } from '@nestjs/sequelize';
import { TransactionHelper } from '../../database/sequelize/transaction.helper';
import { UserRes } from './dto/res/user.res';
import { plainToInstance } from 'class-transformer';
import { UpdateUserRes } from './dto/res/update.user.res';

@Injectable()
export class UserService {

	constructor(
		@InjectModel(User) private readonly userRepository: typeof User,
		private readonly userValidService: UserValidService,
		private readonly transaction: TransactionHelper,
		private readonly logger: WinstonLoggerService,
	) {
		this.logger.setLabel(UserService.name);
	}

	async updateUser(email: string, dto: UpdateUserReq): Promise<UpdateUserRes> {
		return this.transaction.run(async (t) => {
			const target = await this.userRepository.findOne({ where: { email }, transaction: t });
			const allowedFields = ['username', 'email'];
			const filteredReq: UpdateUserReq = Object.fromEntries(
				Object.entries(dto).filter(([key, value]) => allowedFields.includes(key) && value !== undefined),
			);
			await this.userValidService.checkUserDoesNotExist(filteredReq, t);
			await this.userRepository.update(dto, { where: { email }, transaction: t });
			const updatedUser = await this.userRepository.findOne({
				where: { email: filteredReq.email ?? email },
				transaction: t,
			});
			const changes: string[] = [];
			if (filteredReq.email) {
				changes.push(`email: ${email} → ${filteredReq.email}`);
			}
			if (filteredReq.username) {
				changes.push(`username: ${target.username} → ${filteredReq.username}`);
			}
			if (changes.length > 0) {
				this.logger.log(`User updated (${changes.join(', ')})`);
			}
			const data = plainToInstance(UserRes, updatedUser.get({ plain: true }));
			const previousData = plainToInstance(UserRes, target.get({ plain: true }));
			return { data, previousData };
		});
	}

	async changePassword(user: UserPayload, dto: ChangePasswordReq): Promise<boolean> {
		return this.transaction.run(async (t) => {
			const target = await this.userRepository.findOne({ where: { email: user.email }, transaction: t });
			const allowedFields = ['currentPassword', 'newPassword'];
			const filteredReq = Object.fromEntries(
				Object.entries(dto).filter(([key, value]) => allowedFields.includes(key) && value !== undefined));
			await this.userValidService.checkPassword(filteredReq.currentPassword, target.password);
			const hashedPassword = await bcrypt.hash(filteredReq.newPassword, 12);
			await this.userRepository.update(
				{ password: hashedPassword },
				{ where: { id: target.id }, transaction: t },
			);
			return true;
		});
	}

	async deactivateUser(email: string): Promise<boolean> {
		return this.transaction.run(async (t) => {
			await this.userRepository.update(
				{ isActive: false },
				{ where: { email }, transaction: t },
			);
			this.logger.log(`User with email: ${email} - deactivated`);
			return true;
		});
	}
}
