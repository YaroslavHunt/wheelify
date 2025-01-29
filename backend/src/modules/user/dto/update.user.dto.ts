import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

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
}
