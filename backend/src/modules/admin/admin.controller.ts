import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Delete, Get, HttpCode, Patch, Query, UseGuards } from '@nestjs/common';
import User from '../user/model/user.model';
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../common/enums';
import { AdminService } from './admin.service';
import { PaginationResponseDto } from './dto/pagination.users.dto';

@ApiTags('Administrator')
@Roles(Role.ADMIN, Role.MODERATOR)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
	constructor(private readonly adminService: AdminService) {
	}

	@ApiResponse({ status: 200, type: PaginationResponseDto })
	@Get('users-list')
	async getUsersList(
		@Query('search') search?: string,
		@Query('page') page: string = '1',
		@Query('limit') limit: string = '10',
	): Promise<PaginationResponseDto> {
		const pageNum = Number(page);
		const limitNum = Number(limit);
		if (isNaN(pageNum) || isNaN(limitNum) || pageNum <= 0 || limitNum <= 0) {
			throw new Error('Invalid query values. Page and limit must be numbers greater than 0');
		}
		return this.adminService.getUsersList({ search, page: pageNum, limit: limitNum });
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
