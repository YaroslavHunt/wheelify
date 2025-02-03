import { Body, Controller, HttpCode, Patch, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update.user.dto';
import { JwtPayload } from '../../strategy/types';
import { ChangePasswordDto } from './dto/change.password.dto';

@ApiTags('User')
@UseGuards(JwtAuthGuard)
@Controller('cabinet')
export class UserController {
	constructor(private readonly userService: UserService) {}
	@ApiResponse({ status: 202, type: UpdateUserDto })
	@HttpCode(202)
	@Patch('edit')
	updateUser(
		@Body() dto: UpdateUserDto,
		@Req() req: JwtPayload,
	): Promise<UpdateUserDto> {
		const user = req.user;
		return this.userService.updateUser(user.email, dto);
	}

	@ApiResponse({ status: 202, type: Boolean })
	@HttpCode(202)
	@Patch('change-password')
	changePassword(
		@Body() dto: ChangePasswordDto,
		@Req() req: JwtPayload,
	): Promise<boolean> {
		const user = req.user;
		return this.userService.changePassword(user, dto)
	}

	@ApiResponse({ status: 202, type: Boolean })
	@HttpCode(202)
	@Patch('deactivate')
	deactivateUser(@Req() req: JwtPayload): Promise<boolean> {
		const user = req.user;
		return this.userService.deactivateUser(user.email);
	}
}
