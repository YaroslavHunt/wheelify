import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	Length,
	MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../common/enums';

export class CreateUserDto {
	@ApiProperty()
	@IsNotEmpty()
	@Length(3, 20)
	username: string;

	@ApiProperty()
	@IsEmail()
	email: string;

	@ApiProperty()
	@IsString()
	@MinLength(8)
	password: string;

	@IsOptional()
	role?: Role;
}
