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

import User from './model/user.model'

@Injectable()
export class UserValidService {
	constructor(
		@InjectModel(User) private readonly userRepository: typeof User
	) {
	}

	private async findUserByConditions(
		options: WhereOptions<User>,
		t?: Transaction
	): Promise<User | null> {
		const where =
			Object.keys(options).length > 1
				? { [Op.or]: Object.entries(options).map(([key, value]) => ({ [key]: value })) }
				: options

		return await this.userRepository.findOne({
			where,
			transaction: t
		})
	}

	private async checkUserByConditions(user: Partial<User>, shouldExist: boolean, t?: Transaction) {
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


	public async checkPassword(
		entryPassword: string,
		userPassword: string,
		t?: Transaction
	) {
		const validPassword = await bcrypt.compare(entryPassword, userPassword)
		if (!validPassword) {
			throw new UnauthorizedException('Wrong password')
		}
	}
}
