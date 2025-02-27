'use client'

import { useSearchParams } from 'next/navigation'
import { useVerificationMutation } from '@/features/auth/hooks'
import { useEffect } from 'react';
import { AuthWrapper } from '@/features/auth/components/AuthWrapper'
import { Loading } from '@/shared/components/ui'

export function NewVerificationForm() {
	const searchParams = useSearchParams();
	const token = searchParams.get('token');
	const { verification } = useVerificationMutation()

	useEffect(() => {
		verification(token)
	}, [token])

	return <AuthWrapper heading='Mail confirmaition'>
		<div>
			<Loading />
		</div>
	</AuthWrapper>
}
