import { Body, Controller, Delete, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { ApiResponse } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update.user.dto';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {
	}

	@Get()
	getUsers() {
		return this.userService.getUsers();
	}

	@ApiResponse({ status: 202, type: UpdateUserDto })
	@UseGuards(JwtAuthGuard)
	@Patch()
	updateUser(@Body() updateDto: UpdateUserDto, @Req() request): Promise<UpdateUserDto> {
		const user: UpdateUserDto = request.user;
		return this.userService.updateUser(user.email, updateDto);
	}

	@UseGuards(JwtAuthGuard)
	@Delete()
	deleteUser(@Req() request): Promise<boolean> {
		const user = request.user;
		return this.userService.deleteUser(user.email);
	}
}