import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

import User from '../../model/user.model'

export class PaginationUsersRes {
	constructor(users: User[], total: number, page: number, limit: number) {
		this.users = users
		this.total = total
		this.page = page
		this.limit = limit
	}

	@ApiProperty({ type: [User] })
	users: User[]

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
