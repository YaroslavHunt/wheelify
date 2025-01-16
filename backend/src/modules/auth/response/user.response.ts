import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
	@ApiProperty()
	@IsString()
	username: string;

	@ApiProperty()
	@IsString()
	password: string;

	@ApiProperty()
	@IsString()
	email: string;
}

export class AuthUserResponse {
	@ApiProperty()
	user: UserResponse;

	@ApiProperty()
	@IsString()
	token: string;
}
