import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op, WhereOptions } from 'sequelize'

import { toDTO } from '@/database/sequelize/utils/mapper.util'
import { WinstonLoggerService } from '@/logger/logger.service'
import { RegisterUserResDTO } from '../auth/dto/res/register-user-res.dto'
import User from '../user/model/user.model'

import { PaginationUsersRes } from './dto/res/pagination.users.res'

@Injectable()
export class AdminService {
	// constructor(
	// 	@InjectModel(User) private readonly userRepository: typeof User,
	// 	private readonly logger: WinstonLoggerService
	// ) {
	// 	this.logger.setLabel(AdminService.name)
	// }
	//
	// async getUsersList({
	// 	search,
	// 	page,
	// 	limit
	// }: {
	// 	search?: string
	// 	page: number
	// 	limit: number
	// }): Promise<PaginationUsersRes> {
	// 	const where: WhereOptions<User> = search
	// 		? {
	// 				[Op.or]: [
	// 					{ username: { [Op.iLike]: `%${search}%` } },
	// 					{ email: { [Op.iLike]: `%${search}%` } }
	// 				]
	// 			}
	// 		: {}
	// 	const { rows: users, count: total } =
	// 		await this.userRepository.findAndCountAll({
	// 			where,
	// 			limit,
	// 			offset: (page - 1) * limit
	// 		})
	// 	const usersRes = users.map(user => toDTO(RegisterUserResDTO, user))
	// 	return new PaginationUsersRes(usersRes, total, page, limit)
	// }
	//
	// findUserById(id: number): Promise<RegisterUserResDTO> {
	// 	return this.transaction.run(async t => {
	// 		const user = await this.userRepository.findOne({
	// 			where: { id },
	// 			transaction: t
	// 		})
	// 		return toDTO(RegisterUserResDTO, user)
	// 	})
	// }
	//
	// changeUserStatus(id: number): Promise<boolean> {
	// 	return this.transaction.run(async t => {
	// 		const target = await this.userRepository.findOne({
	// 			where: { id },
	// 			transaction: t
	// 		})
	// 		return true
	// 	})
	// }
	//
	// changeUserRole(id: string): Promise<boolean> {
	// 	return this.transaction.run(async t => {
	// 		return true
	// 	})
	// }
	//
	// deleteUser(id: string): Promise<boolean> {
	// 	return this.transaction.run(async t => {
	// 		return true
	// 	})
	// }
}
