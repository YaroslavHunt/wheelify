import { IsNotEmpty, IsString } from 'class-validator'

export class ConfirmationDTO {
	@IsString({ message: 'Token must be a string' })
	@IsNotEmpty({ message: 'Token field is required' })
	token: string
}