import {
	CreationOptional,
	InferAttributes,
	InferCreationAttributes,
	UUIDV4
} from 'sequelize'
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
	tableName: 'documents',
	timestamps: true,
	indexes: [
		{ unique: true, fields: ['id'] },
		{ unique: true, fields: ['user_id'] }
	]
})
export default class TimeDocument extends Model<
	InferAttributes<TimeDocument>,
	InferCreationAttributes<TimeDocument>
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
		allowNull: false
	})
	number: string

	@Column({
		type: DataType.STRING,
		allowNull: false
	})
	series: string

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
