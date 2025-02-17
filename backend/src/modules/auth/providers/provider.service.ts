import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { PROVIDER_OPTIONS_SYMBOL, TypeOptions } from '@/modules/auth/providers/services/constants'
import { BaseOauthService } from '@/modules/auth/providers/services/base-oauth.service'

@Injectable()
export class ProviderService implements OnModuleInit {
	public constructor(
		@Inject(PROVIDER_OPTIONS_SYMBOL) private readonly options: TypeOptions,
	) {
	}

	public onModuleInit(){
		for(const provider of this.options.services){
			provider.baseUrl = this.options.baseUrl
		}
	}

	public findByService(service: string):  BaseOauthService | null {
		return this.options.services.find(s => s.name === service) ?? null
	}
}
