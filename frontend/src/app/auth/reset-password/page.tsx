import type { Metadata } from 'next'
import { ResetPasswordForm } from '@/features/auth/components'

export const metadata: Metadata = {
	title: 'Password reset',
}

export default function ResetPasswordPage() {
	return <ResetPasswordForm />
}