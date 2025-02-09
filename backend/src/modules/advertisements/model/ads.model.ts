import {
	Column,
	DataType,
	ForeignKey,
	Model,
	Table,
} from 'sequelize-typescript';
import User from '../../user/model/user.model';
import { CreationOptional, InferAttributes, InferCreationAttributes, UUIDV4 } from 'sequelize';

@Table({
	tableName: 'advertisements',
	timestamps: true,
	indexes: [
		{ unique: true, fields: ['id'] },
		{ unique: true, fields: ['user_id'] },
		{ fields: ['title'] },
		{ fields: ['description'] },
	],
})
export default class Ads extends Model<InferAttributes<Ads>, InferCreationAttributes<Ads>> {
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

	@Column({
		type: DataType.UUID,
		defaultValue: UUIDV4,
		primaryKey: true,
	})
	id: string;

	@Column({
		type: DataType.STRING(200),
		allowNull: false,
	})
	title: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	description: string;

	@Column({
		type: DataType.INTEGER,
	})
	cost: number;

	@ForeignKey(() => User)
	@Column({
		field: 'user_id',
		type: DataType.UUID,
		allowNull: false,
	})
	user: string;
}
