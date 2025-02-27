import { useMutation } from '@tanstack/react-query'
import { userService } from '@/features/user/services'
import { TypeSettingsSchema } from '@/features/user/schemes'
import { toast } from 'sonner'
import { toastMessageHandler } from '@/shared/utils'

export function useUpdateProfileMutation() {
	const { mutate: update, isPending: isLoadingUpdate} = useMutation({
		mutationKey: ['update'],
		mutationFn: (data: TypeSettingsSchema) => userService.updateProfile(data),
		onSuccess: () => {
			toast.success('Successfully update Profile')
		},
		onError: (e) => {
			toastMessageHandler(e)
		}
	})

	return { update, isLoadingUpdate }
}