import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { WinstonLoggerService } from '@/libs/logger/logger.service'
import User from './model/user.model'
import { UserValidService } from './user-validation/user-validation.service'
import Account from '@/modules/auth/models/account.model'
import { AuthMethod, Role } from '@/libs/common/enums'
import { StorageService } from '@/libs/storage/storage.service'
import { DEFAULT_USER_AVATAR } from '@/libs/common/constants'
import { Sequelize } from 'sequelize-typescript'
import { Transaction } from 'sequelize'

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User) private readonly userRepository: typeof User,
		private sequelize: Sequelize,
		private readonly userValidService: UserValidService,
		private readonly logger: WinstonLoggerService
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
				avatar: avatar ? avatar : null,
				role: Role.USER,
				isVerified,
				method
			},
			{
				include: [{ model: Account }],
				transaction: t
			}
		)
	}

	// public async updateUser(
	// 	email: string,
	// 	dto: UpdateUserReq
	// ): Promise<UpdateUserRes> {
	// 	return this.transaction.run(async t => {
	// 		const target = await this.userRepository.findOne({
	// 			where: { email },
	// 			transaction: t
	// 		})
	// 		const allowedFields = ['username', 'email']
	// 		const filteredReq: UpdateUserReq = Object.fromEntries(
	// 			Object.entries(dto).filter(
	// 				([key, value]) =>
	// 					allowedFields.includes(key) && value !== undefined
	// 			)
	// 		)
	// 		await this.userValidService.checkUserDoesNotExist(filteredReq, t)
	// 		await this.userRepository.update(dto, {
	// 			where: { email },
	// 			transaction: t
	// 		})
	// 		const updatedUser = await this.userRepository.findOne({
	// 			where: { email: filteredReq.email ?? email },
	// 			transaction: t
	// 		})
	// 		const changes: string[] = []
	// 		if (filteredReq.email)
	// 			changes.push(`email: ${email} → ${filteredReq.email}`)
	// 		if (filteredReq.username)
	// 			changes.push(
	// 				`username: ${target.username} → ${filteredReq.username}`
	// 			)
	// 		if (changes.length > 0)
	// 			this.logger.log(`User updated (${changes.join(', ')})`)
	// 		const data = toDTO(RegisterUserResDTO, updatedUser)
	// 		const previousData = toDTO(RegisterUserResDTO, target)
	// 		return { data, previousData }
	// 	})
	// }
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
