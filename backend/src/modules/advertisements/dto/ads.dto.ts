import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdsDto {
	@ApiProperty()
	@IsString()
	title: string;

	@ApiProperty()
	@IsString()
	description: string;
}
