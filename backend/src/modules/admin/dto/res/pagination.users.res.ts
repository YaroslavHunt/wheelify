import { ApiProperty } from '@nestjs/swagger';
import { UserRes } from '../../../user/dto/res/user.res';
import { IsNumber } from 'class-validator';

export class PaginationUsersRes {
	constructor(users: UserRes[], total: number, page: number, limit: number) {
		this.users = users;
		this.total = total;
		this.page = page;
		this.limit = limit;
	}

	@ApiProperty({ type: [UserRes] })
	users: UserRes[];

	@ApiProperty()
	@IsNumber()
	total: number;

	@ApiProperty()
	@IsNumber()
	page: number;

	@ApiProperty()
	@IsNumber()
	limit: number;
}
