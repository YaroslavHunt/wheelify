import { DynamicModule, Module } from '@nestjs/common'
import { PROVIDER_OPTIONS_SYMBOL, TypeAsyncOptions, TypeOptions } from '@/modules/auth/providers/services/constants'
import { ProviderService } from '@/modules/auth/providers/provider.service'

@Module({})
export class ProviderModule {
	public static register(options: TypeOptions): DynamicModule {
		return {
			module: ProviderModule,
			providers: [{
				useValue: options.services,
				provide: PROVIDER_OPTIONS_SYMBOL
			}, ProviderService],
			exports: [ProviderService]
		}
	}

	public static registerAsync(options: TypeAsyncOptions): DynamicModule {
		return {
			module: ProviderModule,
			imports: options.imports,
			providers: [{
				useFactory: options.useFactory,
				provide: PROVIDER_OPTIONS_SYMBOL,
				inject: options.inject,
			}, ProviderService],
			exports: [ProviderService]
		}
	}
}
