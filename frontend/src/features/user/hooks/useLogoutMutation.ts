import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { authService } from '@/features/auth/services'
import { toastMessageHandler } from '@/shared/utils'
import { toast } from 'sonner'

export function useLogoutMutation() {
	const router = useRouter()

	const { mutate: logout, isPending: isLoadingLogout } = useMutation({
		mutationKey: ['logout'],
		mutationFn: () => authService.logout(),
		onSuccess() {
			toast.success('You have successfully left the system')
			router.push('/auth/login')
		},
		onError(e) {
			toastMessageHandler(e)
		}
	})

	return { logout, isLoadingLogout }
}