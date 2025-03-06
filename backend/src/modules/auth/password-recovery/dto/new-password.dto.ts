import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class NewPasswordDTO {
	@ApiProperty()
	@IsString({ message: 'Password must be a string' })
	@IsNotEmpty({ message: 'Field can not be empty' })
	@MinLength(8, { message: 'Password must be at least 8 characters long' })
	password: string
}
