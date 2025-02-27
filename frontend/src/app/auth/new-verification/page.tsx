import { NewVerificationForm } from '@/features/auth/components'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Mail confirmation',
}

export default function Page() {
	return <NewVerificationForm />
}