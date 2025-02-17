import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common'
import { ProviderService } from '@/modules/auth/providers/provider.service'
import { Request } from 'express'

@Injectable()
export class AuthProviderGuard implements CanActivate {
	public constructor(private readonly providerService: ProviderService) {
	}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const req  = context.switchToHttp().getRequest() as Request

		const provider = req.params.provider
		const providerInstance = this.providerService.findByService(provider)

		if (!providerInstance) {
			throw new NotFoundException(
				`Provider '${provider}' not found. Please check the correctness of the data entered.`
			)
		}
		return true
	}
}
