import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { verificationService } from '@/features/auth/services'
import { toast } from 'sonner'

export function useVerificationMutation() {
	const router = useRouter()

	const { mutate: verification } = useMutation({
		mutationKey: ['new verification'],
		mutationFn: (token: string | null) =>
			verificationService.newVerification(token),
			onSuccess() {
				toast.success('Email is successfully confirmed')
				router.push('/dashboard/settings')
			},
			onError() {
				router.push('login')
			}
	})

	return { verification }
}