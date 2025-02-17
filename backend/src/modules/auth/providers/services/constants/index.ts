import { BaseOauthService } from '@/modules/auth/providers/services/base-oauth.service'
import { FactoryProvider, ModuleMetadata } from '@nestjs/common'

export const PROVIDER_OPTIONS_SYMBOL = Symbol()

export type TypeOptions = {
	baseUrl: string,
	services: BaseOauthService[],
}

export type TypeAsyncOptions = Pick<ModuleMetadata, 'imports'> & Pick<FactoryProvider<TypeOptions>, 'useFactory' | 'inject'>