import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class AccountResDTO {
	@ApiProperty({ uniqueItems: true, nullable: false })
	@Expose()
	id: number

	@ApiProperty({ nullable: false })
	@Expose()
	type: string

	@ApiProperty({ nullable: false })
	@Expose()
	provider: string

	@ApiProperty({ nullable: false })
	@Expose()
	expiresAt: Date

	@ApiProperty({ nullable: false })
	@Expose()
	createdAt: Date
}