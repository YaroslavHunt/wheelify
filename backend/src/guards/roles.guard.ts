import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { Role } from '@/libs/common/enums'
import { ROLES_KEY } from '@/decorators/roles.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
	public constructor(private readonly reflector: Reflector) {
	}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass()
		])
		if (!roles) return true
		const req  = context.switchToHttp().getRequest()
		if (!roles.includes(req.user.role)) {
			throw new ForbiddenException('Access denied')
		}
		return true
	}
}
