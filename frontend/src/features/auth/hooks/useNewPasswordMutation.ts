import { useMutation } from '@tanstack/react-query'
import { TypeNewPasswordSchema } from '@/features/auth/schemes'
import { passwordRecoveryService } from '@/features/auth/services/password-recovery.service'
import { toast } from 'sonner'
import { toastMessageHandler } from '@/shared/utils'
import { useRouter, useSearchParams } from 'next/navigation'

export function useNewPasswordMutation() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const token = searchParams.get('token')

	const { mutate: newPassword, isPending: isLoadingNew } = useMutation({
		mutationKey: ['new password'],
		mutationFn: ({
						 values,
						 recaptcha
					 }: {
			values: TypeNewPasswordSchema,
			recaptcha: string
		}) => passwordRecoveryService.new(values, token, recaptcha),
		onSuccess: () => {
			toast.success('Successful password replacement',
				{
					description: 'Now you can log in to your account'
				})
			router.push('/dashboard/settings')
		},
		onError: (e) => {
			toastMessageHandler(e)
		}
	})

	return { newPassword, isLoadingNew }
}