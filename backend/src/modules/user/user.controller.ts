import {
	Body,
	Controller,
	Delete,
	Get,
	Patch,
	Req,
	UseGuards,
} from '@nestjs/common';
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

	@Get()
	getUsers() {
		return this.userService.getUsers();
	}

	@ApiResponse({ status: 202, type: UpdateUserDto })
	@Patch()
	updateUser(
		@Body() updateDto: UpdateUserDto,
		@Req() request: JwtPayload,
	): Promise<UpdateUserDto> {
		const user: UpdateUserDto = request.user;
		return this.userService.updateUser(user.email, updateDto);
	}

	@Delete()
	deleteUser(@Req() request: JwtPayload): Promise<boolean> {
		const user = request.user;
		return this.userService.deleteUser(user.email);
	}
}
