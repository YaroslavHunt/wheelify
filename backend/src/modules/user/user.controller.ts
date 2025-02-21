import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { UserService } from './user.service'
import { Authorized } from '@/modules/auth/decorators/authorized.decorator'
import { Authorization } from '@/modules/auth/decorators/auth.decorator'
import { Role } from '@/libs/common/enums'
import { toDTO } from '@/database/sequelize/utils/mapper.util'
import { UserProfileResDTO } from './dto/res/user-profile-res.dto'
import { UpdateUserReqDTO } from '@/modules/user/dto/req/update-user-profile-req.dto'
import { UpdateUserDTO, UpdateUserResDTO } from '@/modules/user/dto/res/update-user-res.dto'

@ApiTags('Users')
@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {
	}


	@Authorization()
	@HttpCode(HttpStatus.OK)
	@ApiResponse({ status: HttpStatus.OK })
	@Get('profile')
	public async findProfile(@Authorized('id') id: string) {
		return await this.userService.findById(id)
	}

	@Authorization(Role.ADMIN, Role.MODERATOR)
	@HttpCode(HttpStatus.OK)
	@ApiResponse({ status: HttpStatus.OK })
	@Get('by-id/:id')
	public async findById(@Param('id') id: string) {
		const user = await this.userService.findById(id)
		return await toDTO(UserProfileResDTO, user)
	}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@ApiResponse({ status: HttpStatus.OK })
	@Patch('edit-profile')
	public async updateProfile(
		@Authorized('id') id: string,
		@Body() data: UpdateUserReqDTO): Promise<UpdateUserResDTO> {
		const previousUser = await this.userService.findById(id)
		const updatedUser = await this.userService.update(id, data)

		return {
			data: await toDTO(UpdateUserDTO, updatedUser),
			previousData: await toDTO(UpdateUserDTO, previousUser)
		}
	}

	// @ApiResponse({ status: 202, type: Boolean })
	// @HttpCode(202)
	// @Patch('change-password')
	// changePassword(
	// 	@Body() dto: ChangePasswordReq,
	// 	@Req() req: AuthRequest
	// ): Promise<boolean> {
	// 	const user = req.user
	// 	return this.userService.changePassword(user, dto)
	// }
	//
	// @ApiResponse({ status: 202, type: Boolean })
	// @HttpCode(202)
	// @Patch('deactivate')
	// deactivateUser(@Req() req: AuthRequest): Promise<boolean> {
	// 	const user = req.user
	// 	return this.userService.deactivateUser(user.email)
	// }
}
