import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class EquipmentDto {
	@ApiProperty()
	@IsString()
	model: string

	@ApiProperty()
	@IsString()
	type: string
}
