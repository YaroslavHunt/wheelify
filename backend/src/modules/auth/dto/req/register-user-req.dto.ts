import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, MinLength, Validate } from 'class-validator'
import { IsPasswordMatchingConstraint } from '@/modules/user/decorators/is-password-matching-constrains.decorator'

export class RegisterUserReqDTO {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	username: string

	@ApiProperty()
	@IsEmail()
	@IsNotEmpty()
	email: string

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	password: string

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	@Validate(IsPasswordMatchingConstraint, { message: 'Passwords do not match' })
	passwordRepeat: string
}
