import { CreationOptional, InferAttributes, InferCreationAttributes, UUIDV4 } from 'sequelize'
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import User from '@/modules/user/model/user.model'
import { TokenType } from '@/libs/common/enums'

@Table({
	tableName: 'tokens',
	timestamps: true,
	indexes: [
		{ unique: true, fields: ['id'] },
	]
})
export default class Token extends Model<
	InferAttributes<Token>,
	InferCreationAttributes<Token>
> {
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>

	@Column({
		type: DataType.UUID,
		defaultValue: UUIDV4,
		primaryKey: true
	})
	id: string

	@Column({
		type: DataType.STRING,
		allowNull: false,
		unique: true
	})
	email: string

	@Column({
		type: DataType.STRING,
		allowNull: false,
		unique: true
	})
	token: string

	@Column({
		type: DataType.ENUM,
		values: Object.values(TokenType),
		allowNull: false
	})
	type: TokenType

	@Column({
		type: DataType.DATE,
		allowNull: false
	})
	expiresIn: Date

	@ForeignKey(() => User)
	@Column({
		type: DataType.UUID,
		allowNull: true
	})
	userId?: string

	@BelongsTo(() => User)
	user?: User
}


