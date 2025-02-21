import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class CreateAdsResponse {
	@ApiProperty({ name: 'user_id' })
	@IsNumber()
	user: number

	@ApiProperty()
	@IsString()
	title: string

	@ApiProperty()
	@IsString()
	description: string
}
