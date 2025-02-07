import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
	BadRequestException,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	ParseIntPipe,
	Patch,
	Query,
	UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../common/enums';
import { AdminService } from './admin.service';
import { PaginationUsersRes } from './dto/res/pagination.users.res';
import { UserRes } from '../user/dto/res/user.res';

@ApiTags('Administrator service')
@Roles(Role.ADMIN, Role.MODERATOR)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
	constructor(private readonly adminService: AdminService) {
	}

	@ApiResponse({ status: 200, type: PaginationUsersRes })
	@Get('users-list')
	async getUsersList(
		@Query('search') search?: string,
		@Query('page', ParseIntPipe) page: number = 1,
		@Query('limit', ParseIntPipe) limit: number = 10,
	): Promise<PaginationUsersRes> {
		if (page <= 0 || limit <= 0) {
			throw new BadRequestException('Page and limit must be numbers greater than 0');
		}
		return this.adminService.getUsersList({ search, page, limit });
	}

	@ApiResponse({ status: 200, type: UserRes })
	@HttpCode(200)
	@Get('user/:id')
	getUserById(@Param('id', ParseIntPipe) id: number): Promise<UserRes> {
		return this.adminService.findUserById(id);
	}

	@ApiResponse({ status: 202, type: Boolean })
	@HttpCode(202)
	@Patch('user-status/:id')
	changeUserStatus(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
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
