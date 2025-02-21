import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import User from './model/user.model'
import Account from '@/modules/auth/models/account.model'
import { AuthMethod, Role } from '@/libs/common/enums'
import { Transaction } from 'sequelize'
import { UpdateUserReqDTO } from '@/modules/user/dto/req/update-user-profile-req.dto'
import { Sequelize } from 'sequelize-typescript'

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User) private readonly userRepository: typeof User,
		private readonly sequelize: Sequelize,
	) {
	}

	public async findById(id: string) {
		const user = this.userRepository.findOne({ where: { id }, include: [{ model: Account }] })
		if (!user) {
			throw new NotFoundException(`User not found`)
		}
		return user
	}

	public async findByEmail(email: string) {
		const user = this.userRepository.findOne({ where: { email }, include: [{ model: Account }] })
		if (!user) {
			throw new NotFoundException(`User not found`)
		}
		return user
	}

	public async create(
		username: string,
		password: string,
		email: string,
		isVerified: boolean,
		method: AuthMethod,
		avatar?: string,
		t?: Transaction
	) {
		return await this.userRepository.create(
			{
				username,
				password,
				email,
				avatar: avatar ?? null,
				role: Role.USER,
				isVerified,
				method,
			},
			{
				include: [{ model: Account }],
				transaction: t
			}
		)
	}

	public async update(id: string, data: UpdateUserReqDTO) {
		const target = await this.findById(id)
		const t = await this.sequelize.transaction()
		try {
			await target.update(data, { transaction: t })
			await target.save({ transaction: t })
			await t.commit()
			return target
		} catch (e) {
			await t.rollback()
			throw e
		}
	}






	//
	// public async changePassword(
	// 	user: JwtPayload,
	// 	dto: ChangePasswordReq
	// ): Promise<boolean> {
	// 	return this.transaction.run(async t => {
	// 		const target = await this.userRepository.findOne({
	// 			where: { email: user.email },
	// 			transaction: t
	// 		})
	// 		const allowedFields = ['currentPassword', 'newPassword']
	// 		const filteredReq = Object.fromEntries(
	// 			Object.entries(dto).filter(
	// 				([key, value]) =>
	// 					allowedFields.includes(key) && value !== undefined
	// 			)
	// 		)
	// 		await this.userValidService.checkPassword(
	// 			filteredReq.currentPassword,
	// 			target.password
	// 		)
	// 		const hashedPassword = await bcrypt.hash(
	// 			filteredReq.newPassword,
	// 			12
	// 		)
	// 		await this.userRepository.update(
	// 			{ password: hashedPassword },
	// 			{ where: { id: target.id }, transaction: t }
	// 		)
	// 		return true
	// 	})
	// }
	//
	// public async deactivateUser(email: string): Promise<boolean> {
	// 	return this.transaction.run(async t => {
	// 		await this.userRepository.update(
	// 			{ isActive: false },
	// 			{ where: { email }, transaction: t }
	// 		)
	// 		this.logger.log(`User with email: ${email} - deactivated`)
	// 		return true
	// 	})
	// }
}
