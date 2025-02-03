import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import Ads from '../../advertisements/model/ads.model';
import { Role } from '../../../common/enums';

@Table({
	tableName: 'users',
	timestamps: true,
	indexes: [
		{ unique: true, fields: ['id'] },
		{ unique: true, fields: ['email'] },
		{ unique: true, fields: ['username'] },
		{ fields: ['role'] },
	],
})
export default class User extends Model<User> {
	@Column({
		type: DataType.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	})
	id: number;

	@Column({
		type: DataType.STRING,
		allowNull: false,
		unique: true,
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

	@Column({
		type: DataType.ENUM,
		values: Object.values(Role),
	})
	role: Role;

	@Column({
		type: DataType.BOOLEAN,
		defaultValue: true,
	})
	isActive: boolean;

	@HasMany(() => Ads, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	advertisements: Ads[];
}
