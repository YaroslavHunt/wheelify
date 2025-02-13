import {
	Body,
	Controller,
	HttpCode,
	Patch,
	Req,
	UseGuards
} from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { JwtAuthGuard } from '@/guards/jwt.guard'
import { AuthRequest } from '@/strategy/types'

import { ChangePasswordReq } from './dto/req/change.password.req'
import { UpdateUserReq } from './dto/req/update.user.req'
import { UpdateUserRes } from './dto/res/update.user.res'
import { RegisterUserResDTO } from '../auth/dto/res/register-user-res.dto'
import { UserService } from './user.service'

@ApiTags('User')
@UseGuards(JwtAuthGuard)
@Controller('cabinet')
export class UserController {
	constructor(private readonly userService: UserService) {}

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
