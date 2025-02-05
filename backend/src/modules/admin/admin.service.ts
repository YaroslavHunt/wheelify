import { Injectable } from '@nestjs/common';
import User from '../user/model/user.model';
import { WinstonLoggerService } from '../logger/logger.service';
import { InjectModel } from '@nestjs/sequelize';
import { TransactionHelper } from '../../common/transaction.helper';
import { PaginationResponseDto } from './dto/pagination.users.dto';
import { Op, WhereOptions } from 'sequelize';

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
	}): Promise<PaginationResponseDto> {
		const where: WhereOptions<User> = search
			? { username: { [Op.iLike]: `%${search}%` } }
			: {};
		const { rows: users, count: total } = await this.userRepository.findAndCountAll({
			where,
			limit,
			offset: (page - 1) * limit,
		});
		return new PaginationResponseDto(users, total, page, limit);
	}

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