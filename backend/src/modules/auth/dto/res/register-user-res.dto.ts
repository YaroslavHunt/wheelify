import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

import { AuthMethod, Role } from '@/libs/common/enums'

@Expose()
export class RegisterUserResDTO {
	@ApiProperty()
	@Expose()
	id: string

	@ApiProperty()
	@Expose()
	username: string

	@ApiProperty()
	@Expose()
	email: string

	@ApiProperty({ required: false })
	@Expose()
	picture?: string

	@ApiProperty({ default: Role.USER })
	@Expose()
	role: Role

	@ApiProperty({ default: false })
	@Expose()
	isActive: boolean

	@ApiProperty({ default: false })
	@Expose()
	isVerified: boolean = false

	@ApiProperty()
	@Expose()
	method: AuthMethod

	// accounts: Account[] //TODO ??

	@ApiProperty()
	@Expose()
	createdAt: Date
}
