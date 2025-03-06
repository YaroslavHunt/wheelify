import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'

import { UserService } from '@/modules/user/user.service'

@Injectable()
export class AuthGuard implements CanActivate {
	public constructor(private readonly userService: UserService) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest()

		if (typeof req.session.userId === 'undefined') {
			throw new UnauthorizedException('Unauthorized')
		}

		req.user = await this.userService.findById(req.session.userId)
		return true
	}
}
