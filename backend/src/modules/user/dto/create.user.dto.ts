import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../common/constants';

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
	@Length(8, 20)
	password: string;

	@ApiProperty({default: 'user'})
	@IsOptional()
	role?: Role;
}

