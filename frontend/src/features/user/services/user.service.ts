import { IUser } from '@/features/auth/types'
import { api } from '@/shared/api'
import { TypeSettingsSchema } from '@/features/user/schemes'

class UserServices {
	public async findProfile() {
		return await api.get<IUser>('api/v1/users/profile')
	}

	public async updateProfile(body: TypeSettingsSchema) {
		return await api.patch<IUser>('api/v1/users/edit-profile', body)
	}

}

export const userService = new UserServices()