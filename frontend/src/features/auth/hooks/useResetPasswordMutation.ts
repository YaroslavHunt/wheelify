import { useMutation } from '@tanstack/react-query'
import { TypeResetPasswordSchema } from '@/features/auth/schemes'
import { toastMessageHandler } from '@/shared/utils'
import { toast } from 'sonner'
import { passwordRecoveryService } from '@/features/auth/services/password-recovery.service'

export function useResetPasswordMutation() {
	const { mutate: reset, isPending: isLoadingReset } = useMutation({
		mutationKey: ['reset password'],
		mutationFn: ({
						 values,
						 recaptcha
					 }: {
			values: TypeResetPasswordSchema,
			recaptcha: string
		}) => passwordRecoveryService.reset(values, recaptcha),
		onSuccess: () => {
			toast.success('Check your email',
				{
					description: 'The reference to confirm has been sent to your mail'
				})
		},
		onError: (e) => {
			toastMessageHandler(e)
		}
	})

	return { reset, isLoadingReset }
}