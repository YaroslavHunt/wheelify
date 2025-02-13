import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

import { RegisterUserResDTO } from './register-user-res.dto'

export class AuthResponse {
	@ApiProperty()
	user: RegisterUserResDTO

	@ApiProperty()
	@IsString()
	token: string
}
