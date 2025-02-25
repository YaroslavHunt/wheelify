import { TypeLoginSchema, TypeRegisterSchema } from '@/features/auth/schemes'
import { api } from '@/shared/api'
import { IUser } from '../types'

class AuthService {
	public async register(body: TypeRegisterSchema, recaptcha?: string) {
		const headers = recaptcha ? { recaptcha } : undefined

		return await api.post<IUser>('api/v1/auth/register', body, { headers })
	}

	public async login(body: TypeLoginSchema, recaptcha?: string) {
		const headers = recaptcha ? { recaptcha } : undefined

		return await api.post<IUser>('api/v1/auth/login', body, { headers })
	}

	public async oauthByProvider(provider: string) {
		const response = await api.get<{ url: string }>('api/v1/auth/providers')
	}

	public async logout() {
		return await api.post('api/v1/auth/logout')
	}
}

export const authService = new AuthService()