import { Injectable } from '@nestjs/common';
import User from '../user/model/user.model';
import { WinstonLoggerService } from '../logger/logger.service';
import { InjectModel } from '@nestjs/sequelize';
import { TransactionHelper } from '../../database/sequelize/transaction.helper';
import { PaginationUsersRes } from './dto/res/pagination.users.res';
import { Op, WhereOptions } from 'sequelize';
import { UserRes } from '../user/dto/res/user.res';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AdminService {
	constructor(
		@InjectModel(User) private readonly userRepository: typeof User,
		private readonly transaction: TransactionHelper,
		private readonly logger: WinstonLoggerService,
	) {
		this.logger.setLabel(AdminService.name);
	}

	async getUsersList({ search, page, limit }: {
		search?: string,
		page: number,
		limit: number
	}): Promise<PaginationUsersRes> {
		const where: WhereOptions<User> = search ? {
			[Op.or]: [
				{ username: { [Op.iLike]: `%${search}%` } },
				{ email: { [Op.iLike]: `%${search}%` } },
			]
		} : {};
		const { rows: users, count: total } = await this.userRepository.findAndCountAll({
			where,
			limit,
			offset: (page - 1) * limit,
		});
		const usersRes = users.map(user => plainToInstance(UserRes, user));
		return new PaginationUsersRes(usersRes, total, page, limit);
	}

	findUserById(id: number): Promise<UserRes> {
		return this.transaction.run(async (t) => {
			const user = await this.userRepository.findOne({ where: { id }, transaction: t });
			return plainToInstance(UserRes, user);
		});
	}

	changeUserStatus(id: number): Promise<boolean> {
		return this.transaction.run(async (t) => {
			const target = await this.userRepository.findOne({ where: { id }, transaction: t });
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