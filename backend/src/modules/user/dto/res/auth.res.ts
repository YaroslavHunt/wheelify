import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UserRes } from './user.res';

export class AuthRes {
	@ApiProperty()
	user: UserRes;

	@ApiProperty()
	@IsString()
	token: string;
}