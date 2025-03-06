import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import * as bcrypt from 'bcrypt'
import { Op, Transaction, WhereOptions } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'

import { Role } from '@/common/enums'
import TimeDocument from '@/modules/document/model/time-document.model'
import Equipment from '@/modules/equipment/model/equipment.model'
import { ChangeUserReqDTO } from '@/modules/user/dto/req/change-user-req.dto'
import { UpdateUserReqDTO } from '@/modules/user/dto/req/update-user-profile-req.dto'

import { PaginationUsersRes } from './dto/res/pagination-users-res.dto'
import User from './model/user.model'

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User) private readonly userRepository: typeof User,
		private readonly sequelize: Sequelize
	) {}

	private async findUserByConditions(
		options: WhereOptions<User>,
		t?: Transaction
	): Promise<User | null> {
		const where =
			Object.keys(options).length > 1
				? {
						[Op.or]: Object.entries(options).map(
							([key, value]) => ({ [key]: value })
						)
					}
				: options

		return await this.userRepository.findOne({
			where,
			transaction: t
		})
	}

	private async checkUserByConditions(
		user: Partial<User>,
		shouldExist: boolean,
		t?: Transaction
	) {
		const where: WhereOptions<User> = {}
		if (user.email) where.email = user.email
		if (user.username) where.username = user.username
		if (Object.keys(where).length === 0) {
			throw new BadRequestException('Email or username must be provided')
		}
		const isExist = await this.findUserByConditions(where, t)
		if (shouldExist && !isExist) {
			throw new NotFoundException('User not found')
		}
		if (!shouldExist && isExist) {
			throw new ConflictException(
				isExist.email === user.email
					? 'User with this email already exists'
					: 'User with this username already exists'
			)
		}
	}

	public async checkUserDoesNotExist(user: Partial<User>, t?: Transaction) {
		return this.checkUserByConditions(user, false, t)
	}

	public async checkUserExists(user: Partial<User>, t?: Transaction) {
		return this.checkUserByConditions(user, true, t)
	}

	public async checkPassword(entryPassword: string, userPassword: string) {
		const validPassword = await bcrypt.compare(entryPassword, userPassword)
		if (!validPassword) {
			throw new UnauthorizedException('Wrong password')
		}
	}

	public async findById(id: string) {
		const user = await this.userRepository.findOne({
			where: { id },
			include: [{ model: TimeDocument }, { model: Equipment }]
		})
		if (!user) {
			throw new NotFoundException(`User not found`)
		}
		return user
	}

	public async findByEmail(email: string) {
		const user = await this.userRepository.findOne({
			where: { email },
			include: [{ model: TimeDocument }, { model: Equipment }]
		})
		if (!user) {
			throw new NotFoundException(`User not found`)
		}
		return user
	}

	public async createUser(
		username: string,
		password: string,
		email: string,
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
				lastLogin: new Date()
			},
			{
				include: [{ model: TimeDocument }, { model: Equipment }],
				transaction: t
			}
		)
	}

	public async updateUser(
		id: string,
		data: UpdateUserReqDTO | ChangeUserReqDTO
	) {
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

	public async getUsersList({
		search,
		page,
		limit
	}: {
		search?: string
		page: number
		limit: number
	}): Promise<PaginationUsersRes> {
		const where: WhereOptions<User> = search
			? {
					[Op.or]: [
						{ username: { [Op.iLike]: `%${search}%` } },
						{ email: { [Op.iLike]: `%${search}%` } }
					]
				}
			: {}
		const { rows: users, count: total } =
			await this.userRepository.findAndCountAll({
				where,
				limit,
				offset: (page - 1) * limit
			})
		return new PaginationUsersRes(users, total, page, limit)
	}

	public async deleteUser(id: string) {
		const t = await this.sequelize.transaction()
		try {
			await this.userRepository.destroy({ where: { id }, transaction: t })
			await t.commit()
			return true
		} catch (e) {
			await t.rollback()
			throw e
		}
	}
}
