import { ApiProperty } from '@nestjs/swagger';
import User from '../../user/model/user.model';

export class PaginationResponseDto {
	constructor(users: User[], total: number, page: number, limit: number) {
		this.users = users;
		this.total = total;
		this.page = page;
		this.limit = limit;
	}

	@ApiProperty({ type: [User] })
	users: User[];

	@ApiProperty()
	total: number;

	@ApiProperty()
	page: number;

	@ApiProperty()
	limit: number;
}
