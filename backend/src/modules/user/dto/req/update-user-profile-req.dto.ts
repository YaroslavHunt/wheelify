import { ApiProperty } from '@nestjs/swagger'
import {
	IsBoolean,
	IsEmail,
	IsEnum,
	IsOptional,
	IsString,
	Length
} from 'class-validator'

import { UserStatus } from '@/common/enums'

export class UpdateUserReqDTO {
	@ApiProperty()
	@IsString({ message: 'Username must be a string' })
	@Length(3, 20, {
		message: 'Username must be between 3 and 20 characters long'
	})
	@IsOptional()
	username?: string

	@ApiProperty()
	@IsString({ message: 'First name must be a string' })
	@Length(3, 30, {
		message: 'First name must be between 3 and 30 characters long'
	})
	@IsOptional()
	firstname?: string

	@ApiProperty()
	@IsString({ message: 'Last name must be a string' })
	@Length(3, 30, {
		message: 'Last name must be between 3 and 30 characters long'
	})
	@IsOptional()
	lastname?: string

	@ApiProperty()
	@IsEmail({}, { message: 'Invalid email format' })
	@IsOptional()
	email?: string

	@ApiProperty()
	@IsString({ message: 'Phone number must be a string' })
	@Length(3, 30, {
		message: 'Phone number must be between 3 and 30 characters long'
	})
	@IsOptional()
	phone?: string

	@ApiProperty({ enum: UserStatus, enumName: 'UserStatus' })
	@IsEnum(UserStatus, { message: 'Invalid status value' })
	@IsOptional()
	status?: UserStatus

	@ApiProperty()
	@IsBoolean({ message: 'isTwoFactorEnabled must be boolean' })
	@IsOptional()
	isTwoFactorEnabled?: boolean
}
