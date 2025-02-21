import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { AuthMethod, Role } from '@/libs/common/enums'
import { AccountResDTO } from '@/modules/auth/dto/res/account-res.dto'

export class UserProfileResDTO {
	@ApiProperty({ uniqueItems: true, nullable: false })
	@Expose()
	id: string

	@ApiProperty({ uniqueItems: true, nullable: false })
	@Expose()
	username: string

	@ApiProperty({ nullable: true })
	@Expose()
	firstname: string | null

	@ApiProperty({ nullable: true })
	@Expose()
	lastname: string | null

	@ApiProperty({ uniqueItems: true, nullable: false })
	@Expose()
	email: string

	@ApiProperty({ uniqueItems: true, nullable: true })
	@Expose()
	phone: string | null

	@ApiProperty({ nullable: true })
	@Expose()
	avatar: string | null

	@ApiProperty({ enum: Role, default: Role.USER, nullable: false })
	@Expose()
	role: Role

	@ApiProperty()
	@Expose()
	isActive: boolean

	@ApiProperty()
	@Expose()
	isVerified: boolean

	@ApiProperty()
	@Expose()
	isTwoFactorEnabled: boolean

	@ApiProperty({ enum: AuthMethod, nullable: false })
	@Expose()
	method: AuthMethod

	@ApiProperty()
	@Expose()
	createdAt: Date

	@ApiProperty({ nullable: true })
	@Expose()
	updatedAt: Date | null

	@ApiProperty({ isArray: true, type: () => AccountResDTO })
	@Expose()
	@Type(() => AccountResDTO)
	accounts: AccountResDTO[]
}
