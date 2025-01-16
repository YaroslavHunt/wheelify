import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateUserDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@Length(3, 20)
	username: string;

	@ApiProperty()
	@IsEmail()
	@IsNotEmpty()
	email: string;
}
