import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserDto {
	@ApiProperty()
	@IsString()
	username: string;

	@ApiProperty()
	@IsString()
	email: string;
}