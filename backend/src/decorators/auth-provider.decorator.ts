import { AuthProviderGuard } from '@/guards/provider.guard';
import { applyDecorators, UseGuards } from '@nestjs/common';

export function AuthProvider() {
	return applyDecorators(UseGuards(AuthProviderGuard));
}
