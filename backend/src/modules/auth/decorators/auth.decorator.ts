import { applyDecorators, UseGuards } from '@nestjs/common'

import { Role } from '@/common/enums'
import { Roles } from '@/modules/auth/decorators/roles.decorator'
import { AuthGuard } from '@/modules/auth/guards/auth.guard'
import { RolesGuard } from '@/modules/auth/guards/roles.guard'

export function Authorization(...roles: Role[]) {
	if (roles.length > 0) {
		return applyDecorators(
			Roles(...roles),
			UseGuards(AuthGuard, RolesGuard)
		)
	}
	return applyDecorators(UseGuards(AuthGuard))
}
