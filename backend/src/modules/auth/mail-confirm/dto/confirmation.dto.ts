import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class ConfirmationDTO {
	@ApiProperty()
	@IsString({ message: 'Token must be a string' })
	@IsNotEmpty({ message: 'Token field is required' })
	token: string
}