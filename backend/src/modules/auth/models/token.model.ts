import { CreationOptional, InferAttributes, InferCreationAttributes, UUIDV4 } from 'sequelize'
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import User from '@/modules/user/model/user.model'
import { TokenType } from '@/libs/common/enums'

@Table({
	tableName: 'tokens',
	timestamps: false,
	indexes: [
		{ unique: true, fields: ['id'] },
	]
})
export default class Token extends Model<
	InferAttributes<Token>,
	InferCreationAttributes<Token>
> {
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
		field:'expires_at',
		type: DataType.DATE,
		allowNull: false
	})
	expiresAt: Date

	@Column({
		type: DataType.DATE,
		allowNull: false,
		defaultValue: DataType.NOW,
	})
	createdAt: Date
}


