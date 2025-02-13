import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsBoolean, IsDate, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'

import { AuthMethod, Role } from '@/libs/common/enums'

export class RegisterUserResDTO {
	@Expose()
	@ApiProperty()
	@IsString()
	id: string

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@Length(3, 20)
	username: string

	@ApiProperty()
	@IsEmail()
	email: string

	@ApiProperty()
	@IsString()
	@IsOptional()
	picture?: string

	@Expose()
	@ApiProperty({ default: Role.USER })
	role: Role

	@Expose()
	@ApiProperty({ default: false })
	@IsBoolean()
	isActive: boolean

	@ApiProperty({ default: false })
	@IsBoolean()
	isVerified: boolean = false

	@ApiProperty()
	@IsEnum(AuthMethod)
	@IsNotEmpty()
	method: AuthMethod

	// accounts: Account[] //TODO ??

	@Expose()
	@ApiProperty()
	@IsDate()
	createdAt: Date
}
