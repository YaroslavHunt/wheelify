import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { UserService } from './user.service'
import { Authorized } from '@/decorators/authorized.decorator'
import { Authorization } from '@/decorators/auth.decorator'
import { Role } from '@/libs/common/enums'
import { toDTO } from '@/database/sequelize/utils/mapper.util'
import { UserProfileDTO } from '@/modules/user/dto/res/user-profile.dto'

@ApiTags('Users')
@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {
	}


	@Authorization()
	@HttpCode(HttpStatus.OK)
	@ApiResponse({ status: HttpStatus.OK })
	@Get('profile')
	public async findProfile(@Authorized('id') userId: string) {
		return await this.userService.findById(userId)
	}

	@Authorization(Role.ADMIN, Role.MODERATOR)
	@HttpCode(HttpStatus.OK)
	@ApiResponse({ status: HttpStatus.OK })
	@Get('by-id/:id')
	public async findById(@Param('id') id: string) {
		const user = await this.userService.findById(id)
		return toDTO(UserProfileDTO, user)
	}

	// @ApiResponse({ status: 202, type: RegisterUserResDTO })
	// @HttpCode(202)
	// @Patch('edit')
	// updateUser(
	// 	@Body() dto: UpdateUserReq,
	// 	@Req() req: AuthRequest
	// ): Promise<UpdateUserRes> {
	// 	const user = req.user
	// 	return this.userService.updateUser(user.email, dto)
	// }
	//
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
