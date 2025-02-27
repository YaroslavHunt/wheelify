import { useMutation } from '@tanstack/react-query'
import { TypeLoginSchema } from '@/features/auth/schemes'
import { authService } from '@/features/auth/services'
import { toastMessageHandler } from '@/shared/utils'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction } from 'react'

export function useLoginMutation(setIsShowTwoFactor: Dispatch<SetStateAction<boolean>>) {
	const router = useRouter()

	const { mutate: login, isPending: isLoadingLogin } = useMutation({
		mutationKey: ['login user'],
		mutationFn: ({
						 values,
						 recaptcha
					 }: {
			values: TypeLoginSchema,
			recaptcha: string
		}) => authService.login(values, recaptcha),
		onSuccess: (data: any) => {
			if (data.message) {
				toastMessageHandler(data)
				setIsShowTwoFactor(true)
			} else {
				toast.success('Successfully authorized')
				router.push('/dashboard/settings')
			}
		},
		onError: (e) => {
			toastMessageHandler(e)
		}
	})

	return { login, isLoadingLogin }
}