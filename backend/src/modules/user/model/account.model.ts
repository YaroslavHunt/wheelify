import { CreationOptional, InferAttributes, InferCreationAttributes, UUIDV4 } from 'sequelize'
import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript'
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
		type: DataType.INTEGER,
		autoIncrement: true,
		primaryKey: true
	})
	id: number

	@Column({
		type: DataType.STRING,
		allowNull: false
	})
	type: string

	@Column({
		type: DataType.STRING,
		allowNull: false
	})
	provider: string

	@Column({
		type: DataType.STRING,
		allowNull: true
	})
	refreshToken?: string

	@Column({
		type: DataType.STRING,
		allowNull: true
	})
	accessToken?: string

	@Column({
		type: DataType.DATE,
		allowNull: false
	})
	expiresAt: Date

	@ForeignKey(() => User)
	@Column({
		type: DataType.UUID,
		allowNull: true
	})
	userId?: string

	@BelongsTo(() => User)
	user?: User
}
