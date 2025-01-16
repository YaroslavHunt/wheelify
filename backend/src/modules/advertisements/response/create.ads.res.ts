import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdsResponse {
	@ApiProperty({name: 'user_id'})
	@IsNumber()
	user: number;

	@ApiProperty()
	@IsString()
	title: string;

	@ApiProperty()
	@IsString()
	description: string;

	@ApiProperty()
	@IsNumber()
	cost: number;
}
