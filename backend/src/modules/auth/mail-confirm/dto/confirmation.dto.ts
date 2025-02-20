import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ConfirmationDTO {
	@ApiProperty()
	@IsString({ message: 'Token must be a string' })
	@IsNotEmpty({ message: 'Token field is required' })
	token: string
}