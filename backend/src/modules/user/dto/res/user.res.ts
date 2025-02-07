import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../../common/enums';
import { Exclude } from 'class-transformer';

export class UserRes {
	@ApiProperty()
	@IsString()
	id: string;

	@ApiProperty()
	@IsString()
	username: string;

	@ApiProperty()
	@IsString()
	email: string;

	@Exclude()
	@ApiProperty()
	@IsString()
	password: string;

	@ApiProperty()
	@IsOptional()
	role: Role;

	@ApiProperty()
	@IsDate()
	createdAt: Date;

	@ApiProperty()
	@IsDate()
	updatedAt: Date;
}


