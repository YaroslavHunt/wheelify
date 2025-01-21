import { Body, Controller, Delete, HttpCode, Patch, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update.user.dto';
import { JwtPayload } from '../../strategy/types';

@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@ApiResponse({ status: 202, type: UpdateUserDto })
	@HttpCode(202)
	@Patch()
	updateUser(
		@Body() updateDto: UpdateUserDto,
		@Req() req: JwtPayload,
	): Promise<UpdateUserDto> {
		return this.userService.updateUser(req.user.email, updateDto);
	}

	@Delete()
	deleteUser(@Req() request: JwtPayload): Promise<boolean> {
		const user = request.user;
		return this.userService.deleteUser(user.email);
	}
}
