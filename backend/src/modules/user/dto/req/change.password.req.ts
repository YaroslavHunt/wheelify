import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordReq {
	@ApiProperty()
	@IsString()
	@MinLength(8)
	currentPassword: string;

	@ApiProperty()
	@IsString()
	@MinLength(8)
	newPassword: string;
}