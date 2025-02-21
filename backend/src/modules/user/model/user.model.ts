import { CreationOptional, InferAttributes, InferCreationAttributes, UUIDV4 } from 'sequelize'
import { BeforeCreate, BeforeUpdate, Column, DataType, HasMany, Model, Table } from 'sequelize-typescript'
import * as bcrypt from 'bcrypt'

import { AuthMethod, Role } from 'src/libs/common/enums'
import Ads from '../../advertisements/model/ads.model'
import Account from '@/modules/auth/models/account.model'

@Table({
	tableName: 'users',
	timestamps: false,
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
	@Column({
		type: DataType.UUID,
		defaultValue: UUIDV4,
		primaryKey: true,
		unique: true,
	})
	declare id: string

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
	avatar?: string

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

	@Column({
		field: 'created_at',
		type: DataType.DATE,
		allowNull: false,
		defaultValue: DataType.NOW,
	})
	declare createdAt: CreationOptional<Date>

	@Column({
		field: 'updated_at',
		type: DataType.DATE,
		allowNull: true,
	})
	declare updatedAt: CreationOptional<Date>

	@BeforeUpdate
	static setUpdatedAt(instance: User) {
		instance.updatedAt = new Date();
	}

	@BeforeCreate
	@BeforeUpdate
	static async hashPassword(user: User) {
		if (user.changed('password') && user.password) {
			const salt = await bcrypt.genSalt(12)
			user.password = await bcrypt.hash(user.password, salt)
		}
	}
}
