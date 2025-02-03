import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Delete, Get, HttpCode, Patch, Query, UseGuards } from '@nestjs/common';
import User from '../user/model/user.model';
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../common/enums';
import { AdminService } from './admin.service';

@ApiTags('Administrator')
@Roles(Role.ADMIN, Role.MODERATOR)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
	constructor(private readonly adminService: AdminService) {
	}

	@ApiResponse({ status: 200, type: [User] })
	@HttpCode(200)
	@Get('users-list')
	getAllUsers(): Promise<User[]> {
		return this.adminService.getAllUsers();
	}

	@ApiResponse({ status: 200, type: User })
	@HttpCode(200)
	@Get('user')
	getUserById(@Query() id: string): Promise<User> {
		return this.adminService.findUserById(id);
	}

	@ApiResponse({ status: 202, type: Boolean })
	@HttpCode(202)
	@Patch('user-status')
	changeUserStatus(@Query() id: string): Promise<boolean> {
		return this.adminService.changeUserStatus(id);
	}

	@ApiResponse({ status: 202, type: Boolean })
	@HttpCode(202)
	@Roles(Role.ADMIN)
	@UseGuards(RolesGuard)
	@Patch('user-role')
	changeUserRole(@Query() id: string): Promise<boolean> {
		return this.adminService.changeUserRole(id);
	}

	@ApiResponse({ status: 200, type: Boolean })
	@HttpCode(200)
	@Roles(Role.ADMIN)
	@UseGuards(RolesGuard)
	@Delete('delete-user')
	deleteUser(@Query() id: string): Promise<boolean> {
		return this.adminService.deleteUser(id);
	}

}
