import { InferAttributes, InferCreationAttributes, UUIDV4 } from 'sequelize'
import {
	BelongsTo,
	Column,
	DataType,
	ForeignKey,
	Model,
	Table
} from 'sequelize-typescript'

import User from '../../user/model/user.model'

@Table({
	tableName: 'equipments',
	timestamps: false,
	indexes: [{ unique: true, fields: ['id'] }]
})
export default class Equipment extends Model<
	InferAttributes<Equipment>,
	InferCreationAttributes<Equipment>
> {
	@Column({
		type: DataType.UUID,
		defaultValue: UUIDV4,
		primaryKey: true
	})
	declare id: string

	@Column({
		type: DataType.STRING
	})
	model: string

	@Column({
		type: DataType.STRING,
		allowNull: false
	})
	type: string

	@ForeignKey(() => User)
	@Column({
		field: 'user_id',
		type: DataType.UUID,
		allowNull: false
	})
	userId: string

	@BelongsTo(() => User)
	user: User
}
