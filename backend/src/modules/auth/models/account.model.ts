import { InferAttributes, InferCreationAttributes, UUIDV4 } from 'sequelize'
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import User from '@/modules/user/model/user.model'

@Table({
	tableName: 'accounts',
	timestamps: false,
	indexes: [
		{ unique: true, fields: ['id'] },
	]
})
export default class Account extends Model<
	InferAttributes<Account>,
	InferCreationAttributes<Account>
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
	email: string

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
		field: 'access_token',
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

	@Column({
		field: 'created_at',
		type: DataType.DATE,
		allowNull: false,
		defaultValue: DataType.NOW,
	})
	declare createdAt: Date
}
