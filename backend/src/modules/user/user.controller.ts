import {
	BadRequestException,
	Body,
	Controller,
	DefaultValuePipe,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseIntPipe,
	Patch,
	Query
} from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { Role } from '@/common/enums'
import { Authorization } from '@/modules/auth/decorators/auth.decorator'
import { Authorized } from '@/modules/auth/decorators/authorized.decorator'
import { UpdateUserReqDTO } from '@/modules/user/dto/req/update-user-profile-req.dto'

import { ChangeUserReqDTO } from './dto/req/change-user-req.dto'
import { PaginationUsersRes } from './dto/res/pagination-users-res.dto'
import { UserService } from './user.service'

@ApiTags('Users')
@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@ApiResponse({ status: HttpStatus.OK })
	@Get('profile')
	public async findProfile(@Authorized('id') id: string) {
		return await this.userService.findById(id)
	}

	@Authorization(Role.ADMIN)
	@HttpCode(HttpStatus.OK)
	@ApiResponse({ status: HttpStatus.OK })
	@Get('by-id/:id')
	public async findById(@Param('id') id: string) {
		return this.userService.findById(id)
	}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@ApiResponse({ status: HttpStatus.OK })
	@Patch('edit-profile')
	public async updateProfile(
		@Authorized('id') id: string,
		@Body() data: UpdateUserReqDTO
	) {
		const previousUser = await this.userService.findById(id)
		const updatedUser = await this.userService.updateUser(id, data)

		return {
			data: updatedUser,
			previousData: previousUser
		}
	}

	@Authorization(Role.ADMIN)
	@HttpCode(HttpStatus.OK)
	@ApiResponse({ status: HttpStatus.OK })
	@Patch('change-profile/:id')
	public async changeUserProfileById(
		@Body() data: ChangeUserReqDTO,
		@Param('id') id: string
	) {
		return this.userService.updateUser(id, data)
	}

	@Authorization(Role.ADMIN)
	@HttpCode(HttpStatus.OK)
	@ApiResponse({ status: HttpStatus.OK, type: PaginationUsersRes })
	@Get('users-list')
	public async getUsersList(
		@Query('search') search?: string,
		@Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
		@Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number
	): Promise<PaginationUsersRes> {
		if (page <= 0 || limit <= 0) {
			throw new BadRequestException(
				'Page and limit must be numbers greater than 0'
			)
		}
		return this.userService.getUsersList({ search, page, limit })
	}

	@Authorization(Role.ADMIN)
	@HttpCode(HttpStatus.OK)
	@ApiResponse({ status: 200, type: Boolean })
	@Delete('delete-user/:id')
	public async deleteUser(@Param('id') id: string) {
		return this.userService.deleteUser(id)
	}
}
