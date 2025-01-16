import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	Length,
	MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../common/constants';

export class CreateUserDto {
	@ApiProperty()
	@IsNotEmpty()
	@Length(3, 20, { message: 'Incorrect username length.' })
	username: string;

	@ApiProperty()
	@IsEmail({}, { message: 'Invalid email format' })
	email: string;

	@ApiProperty()
	@IsString()
	@MinLength(8, { message: 'Password must be at least 8 characters long' })
	password: string;

	@IsOptional()
	role?: Role;
}
