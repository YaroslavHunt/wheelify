import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class RegisterUserReqDTO {
	@ApiProperty()
	@IsString({ message: 'Username must be a string' })
	@IsNotEmpty({ message: 'Username is required' })
	username: string

	@ApiProperty()
	@IsEmail({}, { message: 'Invalid email format' })
	@IsNotEmpty({ message: 'Email is required' })
	email: string

	@ApiProperty()
	@IsString({ message: 'Password must be a string' })
	@IsNotEmpty({ message: 'Password is required' })
	@MinLength(8, { message: 'Password must be at least 8 characters long' })
	password: string
}
