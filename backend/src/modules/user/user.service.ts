import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update.user.dto';
import User from './model/user.model';
import { UserPayload } from '../../strategy/types';
import { ChangePasswordDto } from './dto/change.password.dto';
import { UserValidService } from './user.validation.service';
import { WinstonLoggerService } from '../logger/logger.service';
import { InjectModel } from '@nestjs/sequelize';
import { TransactionHelper } from '../../common/transaction.helper';

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

	async updateUser(email: string, dto: UpdateUserDto): Promise<UpdateUserDto> {
		return this.transaction.run(async (t) => {
			const allowedFields = ['username', 'email'];
			const filteredReq: UpdateUserDto = Object.fromEntries(
				Object.entries(dto).filter(([key, value]) => allowedFields.includes(key) && value !== undefined),
			);
			if (filteredReq.email || filteredReq.username) {
				await this.userValidService.checkUserDoesNotExist(filteredReq, t);
			}
			this.logger.log(`User with email: ${email} change username to: ${dto.username} email to: ${dto.email}`);
			await this.userRepository.update(filteredReq, { where: { email }, transaction: t });
			return this.userValidService.publicUser(email);
		});
	}

	async changePassword(user: UserPayload, dto: ChangePasswordDto): Promise<boolean> {
		return this.transaction.run(async (t) => {
			const target = await this.userValidService.findUserBy({ email: user.email }, t);
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
