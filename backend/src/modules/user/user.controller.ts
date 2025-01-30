import { Body, Controller, Delete, HttpCode, Patch, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update.user.dto';
import { JwtPayload } from '../../strategy/types';
import { ChangePasswordDto } from './dto/change.password.dto';

@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@ApiResponse({ status: 202, type: UpdateUserDto })
	@HttpCode(202)
	@Patch()
	updateUser(
		@Body() dto: UpdateUserDto,
		@Req() req: JwtPayload,
	): Promise<UpdateUserDto> {
		return this.userService.updateUser(req.user.email, dto);
	}

	@ApiResponse({ status: 202, type: UpdateUserDto })
	@HttpCode(202)
	@Patch()
	changePassword(
		@Body() dto: ChangePasswordDto,
		@Req() req: JwtPayload,
	): Promise<boolean> {
		const user = req.user;
		return this.userService.changePassword(user, dto)
	}

	@Delete()
	deleteUser(@Req() req: JwtPayload): Promise<boolean> {
		const user = req.user;
		return this.userService.deleteUser(user.email);
	}
}
