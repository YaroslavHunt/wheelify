import { ApiProperty } from '@nestjs/swagger'

import { RegisterUserResDTO } from '../../../auth/dto/res/register-user-res.dto'

export class UpdateUserRes {
	@ApiProperty({ type: () => RegisterUserResDTO })
	data: RegisterUserResDTO

	@ApiProperty({ type: () => RegisterUserResDTO })
	previousData: RegisterUserResDTO
}
