import { Body, Controller, HttpCode, Patch, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserReq } from './dto/req/update.user.req';
import { JwtPayload } from '../../strategy/types';
import { ChangePasswordReq } from './dto/req/change.password.req';
import { UserRes } from './dto/res/user.res';
import { UpdateUserRes } from './dto/res/update.user.res';

@ApiTags('User')
@UseGuards(JwtAuthGuard)
@Controller('cabinet')
export class UserController {
	constructor(private readonly userService: UserService) {}
	@ApiResponse({ status: 202, type: UserRes })
	@HttpCode(202)
	@Patch('edit')
	updateUser(
		@Body() dto: UpdateUserReq,
		@Req() req: JwtPayload,
	): Promise<UpdateUserRes> {
		const user = req.user;
		return this.userService.updateUser(user.email, dto);
	}

	@ApiResponse({ status: 202, type: Boolean })
	@HttpCode(202)
	@Patch('change-password')
	changePassword(
		@Body() dto: ChangePasswordReq,
		@Req() req: JwtPayload,
	): Promise<boolean> {
		const user = req.user;
		return this.userService.changePassword(user, dto)
	}

	@ApiResponse({ status: 202, type: Boolean })
	@HttpCode(202)
	@Patch('deactivate')
	deactivateUser(
		@Req() req: JwtPayload
	): Promise<boolean> {
		const user = req.user;
		return this.userService.deactivateUser(user.email);
	}
}
