import { UserRes } from './user.res';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRes {
	@ApiProperty({ type: () => UserRes })
	data: UserRes;

	@ApiProperty({ type: () => UserRes })
	previousData: UserRes;
}


