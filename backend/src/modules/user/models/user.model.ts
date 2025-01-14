import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import Ads from '../../watchlist/models/ads.model';

@Table({
	tableName: 'users',
	timestamps: true,
})
export default class User extends Model<User> {
	@Column({
		field: 'user_id',
		type: DataType.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	})
	id: number;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	username: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	password: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
		unique: true,
	})
	email: string;

	@HasMany(() => Ads, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	watchlist: Ads[];
}