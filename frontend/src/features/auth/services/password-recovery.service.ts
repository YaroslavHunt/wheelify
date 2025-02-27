import { TypeNewPasswordSchema, TypeResetPasswordSchema } from '@/features/auth/schemes'
import { api } from '@/shared/api'
import { IUser } from '../types'

class PasswordRecoveryService {
	public async reset(body: TypeResetPasswordSchema, recaptcha?: string) {
		const headers = recaptcha ? { recaptcha } : undefined

		return await api.post<IUser>('api/v1/auth/password-recovery/reset', body, { headers })
	}

	public async new(
		body: TypeNewPasswordSchema,
		token: string | null,
		recaptcha?: string
	) {
		const headers = recaptcha ? { recaptcha } : undefined

		return await api.post<IUser>(`api/v1/auth/password-recovery/new/${token}`, body, { headers })
	}
}

export const passwordRecoveryService = new PasswordRecoveryService()