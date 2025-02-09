import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Role } from '../common/enums';
import { Reflector } from '@nestjs/core';
import { AuthRequest, JwtPayload } from '../strategy/types';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const roles =
			this.reflector.get<Role[]>('roles', context.getHandler()) ||
			this.reflector.get<Role[]>('roles', context.getClass());
		if (!roles) return true;
		const req: AuthRequest = context.switchToHttp().getRequest();
		const user: JwtPayload = req.user;
		if (!roles.includes(user.role)) {
			throw new ForbiddenException('Access denied');
		}
		return true;
	}
}
