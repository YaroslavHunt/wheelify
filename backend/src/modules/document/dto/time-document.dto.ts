import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class DocumentDto {
	@ApiProperty()
	@IsString()
	number: string

	@ApiProperty()
	@IsString()
	series: string
}
