import { Injectable } from '@nestjs/common';
import User from '../user/model/user.model';
import { WinstonLoggerService } from '../logger/logger.service';
import { InjectModel } from '@nestjs/sequelize';
import { TransactionHelper } from '../../common/transaction.helper';

@Injectable()
export class AdminService {
	constructor(
		@InjectModel(User) private readonly userRepository: typeof User,
		private readonly transaction: TransactionHelper,
		private readonly logger: WinstonLoggerService,
	) {
		this.logger.setLabel(AdminService.name);
	}

	getAllUsers(): Promise<User[]> {
		return this.userRepository.findAll();
	}

	//TODO pagination

	findUserById(id: string): Promise<User> {
		return this.transaction.run(async (t) => {
			return this.userRepository.findOne({ where: { id }, transaction: t });
		});
	}

	//TODO
	changeUserStatus(id: string): Promise<boolean> {
		return this.transaction.run(async (t) => {
			return true;
		});
	}

	changeUserRole(id: string): Promise<boolean> {
		return this.transaction.run(async (t) => {
			return true;
		});
	}

	deleteUser(id: string): Promise<boolean> {
		return this.transaction.run(async (t) => {
			return true;
		});
	}
}