import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserLoginDto {
	@ApiProperty()
	@IsEmail({})
	email: string;

	@ApiProperty()
	@IsString()
	@MinLength(8, { message: 'Password must be at least 8 characters long' })
	password: string;
}
