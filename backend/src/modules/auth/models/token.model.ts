import { InferAttributes, InferCreationAttributes, UUIDV4 } from 'sequelize'
import { Column, DataType, Model, Table } from 'sequelize-typescript'

import { TokenType } from '@/common/enums'

@Table({
	tableName: 'tokens',
	timestamps: false,
	indexes: [{ unique: true, fields: ['id'] }]
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
	declare id: string

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
		field: 'expires_at',
		type: DataType.DATE,
		allowNull: false
	})
	expiresAt: Date

	@Column({
		field: 'created_at',
		type: DataType.DATE,
		allowNull: false,
		defaultValue: DataType.NOW
	})
	declare createdAt: Date
}
