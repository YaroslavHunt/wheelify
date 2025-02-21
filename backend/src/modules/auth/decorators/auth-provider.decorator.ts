import { AuthProviderGuard } from '@/modules/auth/guards/provider.guard';
import { applyDecorators, UseGuards } from '@nestjs/common';

export function AuthProvider() {
	return applyDecorators(UseGuards(AuthProviderGuard));
}
