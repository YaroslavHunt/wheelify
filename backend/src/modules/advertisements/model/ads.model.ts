import {
	Column,
	DataType,
	ForeignKey,
	Model,
	Table,
} from 'sequelize-typescript';
import User from '../../user/model/user.model';

@Table({
	tableName: 'advertisements',
	timestamps: true,
})
export default class Ads extends Model<Ads> {
	@Column({
		type: DataType.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	})
	id?: number;

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
		type: DataType.INTEGER,
		allowNull: false,
	})
	user: number;
}
