'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/shared/components/ui'
import { useMutation } from '@tanstack/react-query'
import { authService } from '@/features/auth/services'

export function AuthSocial() {
	const router = useRouter()

	const { mutateAsync } = useMutation({
		mutationKey: ['oauth by provider'],
		mutationFn: async (provider: string) =>  await authService.oauthByProvider(provider)
	})

	const onClick = async (provider: string) => {
		const response = await mutateAsync(provider)

		if (response) {
			router.push(response.url)
		}
	}

	return (
		<>
			<div className='grid grid-cols-2'>
				<Button
					onClick={() => onClick('google')}
					variant="outline"
					className="w-full flex items-center justify-center gap-2"
				>
					<img
						width="20"
						height="20"
						src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
						alt="Google Logo"
						className="h-5 w-5"
					/>
					<span className="text-lg font-medium">Continue with Google</span>
				</Button>
			</div>
		</>
	)
}
