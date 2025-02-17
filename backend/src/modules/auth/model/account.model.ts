import { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize'
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import User from '@/modules/user/model/user.model'

@Table({
	tableName: 'accounts',
	timestamps: true,
	indexes: [
		{ unique: true, fields: ['id'] },
	]
})
export default class Account extends Model<
	InferAttributes<Account>,
	InferCreationAttributes<Account>
> {
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>

	@Column({
		type: DataType.STRING,
		unique: true,
		primaryKey: true
	})
	id: string

	@Column({
		type: DataType.STRING,
		allowNull: false
	})
	type: string

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	provider: string


	@Column({
		field: 'refresh_token',
		type: DataType.STRING,
		allowNull: true,
		unique: true
	})
	accessToken?: string

	@Column({
		field: 'refresh_token',
		type: DataType.STRING,
		allowNull: true,
		unique: true
	})
	refreshToken?: string

	@Column({
		field: 'expires_at',
		type: DataType.INTEGER,
		allowNull: false
	})
	expiresAt: number

	@ForeignKey(() => User)
	@Column({
		field: 'user_id',
		type: DataType.UUID,
		allowNull: true
	})
	userId?: string

	@BelongsTo(() => User)
	user?: User
}
