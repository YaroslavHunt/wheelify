import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, MinLength, Validate } from 'class-validator'
import { IsPasswordMatchingConstraint } from '@/modules/auth/dto/decorators/is-password-matching-constrains.decorator'

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

	@ApiProperty()
	@IsString({ message: 'Password confirmation must be a string' })
	@IsNotEmpty({ message: 'Password confirmation is required' })
	@MinLength(8, { message: 'Password confirmation must be at least 8 characters long' })
	@Validate(IsPasswordMatchingConstraint, { message: 'Passwords do not match' })
	passwordRepeat: string
}
