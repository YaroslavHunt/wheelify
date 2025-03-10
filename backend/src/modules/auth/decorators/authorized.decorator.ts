import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import User from '@/modules/user/model/user.model'

export const Authorized = createParamDecorator(
	(data: keyof User, ctx: ExecutionContext) => {
		const req = ctx.switchToHttp().getRequest()
		const user = req.user

		return data ? user[data] : user
	}
)
