import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length, MinLength } from 'class-validator';
import { Role } from '../../../common/enums';

export class UpdateUserDto {
	@ApiProperty()
	@IsString()
	@Length(3, 20)
	@IsOptional()
	username?: string;

	@ApiProperty()
	@IsEmail()
	@IsOptional()
	email?: string;

	@ApiProperty()
	@IsString()
	@MinLength(8)
	@IsOptional()
	password?: string;

	@IsOptional()
	role?: Role;
}
