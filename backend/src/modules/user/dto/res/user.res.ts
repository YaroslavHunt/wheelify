import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../../common/enums';
import { Expose } from 'class-transformer';

export class UserRes {
	@ApiProperty()
	@IsString()
	@Expose()
	id: string;

	@ApiProperty()
	@IsString()
	@Expose()
	username: string;

	@ApiProperty()
	@IsString()
	@Expose()
	email: string;

	@ApiProperty()
	@IsOptional()
	@Expose()
	role: Role;

	@ApiProperty()
	@IsBoolean()
	@Expose()
	isActive: boolean;

	@ApiProperty()
	@IsDate()
	@Expose()
	createdAt: Date;

	@ApiProperty()
	@IsDate()
	@Expose()
	updatedAt: Date;
}


