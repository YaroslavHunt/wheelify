import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

import { RegisterUserResDTO } from '../../../auth/dto/res/register-user-res.dto'

export class PaginationUsersRes {
	constructor(users: RegisterUserResDTO[], total: number, page: number, limit: number) {
		this.users = users
		this.total = total
		this.page = page
		this.limit = limit
	}

	@ApiProperty({ type: [RegisterUserResDTO] })
	users: RegisterUserResDTO[]

	@ApiProperty()
	@IsNumber()
	total: number

	@ApiProperty()
	@IsNumber()
	page: number

	@ApiProperty()
	@IsNumber()
	limit: number
}
