import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class ResetPasswordDTO {
	@ApiProperty()
	@IsEmail({}, { message: 'Invalid email format' })
	@IsNotEmpty({ message: 'Email is required' })
	email: string
}