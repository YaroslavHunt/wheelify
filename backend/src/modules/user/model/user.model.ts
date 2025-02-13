import { CreationOptional, InferAttributes, InferCreationAttributes, UUIDV4 } from 'sequelize'
import { BeforeCreate, BeforeUpdate, Column, DataType, HasMany, Model, Table } from 'sequelize-typescript'
import * as bcrypt from 'bcrypt'

import { AuthMethod, Role } from 'src/libs/common/enums'
import Ads from '../../advertisements/model/ads.model'
import Account from '@/modules/user/model/account.model'

@Table({
	tableName: 'users',
	timestamps: true,
	indexes: [
		{ unique: true, fields: ['id'] },
		{ unique: true, fields: ['email'] },
		{ unique: true, fields: ['username'] },
		{ fields: ['role'] }
	]
})
export default class User extends Model<
	InferAttributes<User>,
	InferCreationAttributes<User>
> {
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>

	@Column({
		type: DataType.UUID,
		defaultValue: UUIDV4,
		primaryKey: true,
		unique: true,
	})
	id: string

	@Column({
		type: DataType.STRING,
		allowNull: false,
		unique: true
	})
	username: string

	@Column({
		type: DataType.STRING,
	})
	firstname?: string

	@Column({
		type: DataType.STRING,
	})
	lastname?: string

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	password: string

	@Column({
		type: DataType.STRING,
		allowNull: false,
		unique: true
	})
	email: string

	@Column({
		type: DataType.STRING,
		allowNull: true,
		unique: true,
	})
	phone?: string

	@Column({
		type: DataType.STRING,
	})
	picture?: string

	@Column({
		type: DataType.ENUM,
		values: Object.values(Role),
		defaultValue: Role.USER
	})
	role: Role

	@Column({
		field: 'is_active',
		type: DataType.BOOLEAN,
		defaultValue: true
	})
	isActive: boolean

	@Column({
		field: 'is_verified',
		type:DataType.BOOLEAN,
		defaultValue: false
	})
	isVerified: boolean;

	@Column({
		field: 'is_two_factor_enabled',
		type:DataType.BOOLEAN,
		defaultValue: false
	})
	isTwoFactorEnabled: boolean

	@Column({
		type: DataType.ENUM,
		values: Object.values(AuthMethod),
	})
	method: AuthMethod

	@HasMany(() => Account, {
		onDelete: 'CASCADE',
	})
	accounts: Account[]

	@HasMany(() => Ads, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE'
	})
	advertisements: Ads[]

	@BeforeCreate
	@BeforeUpdate
	static async hashPassword(user: User) {
		if (user.changed('password')) {
			const salt = await bcrypt.genSalt(10)
			user.password = await bcrypt.hash(user.password, salt)
		}
	}
}
