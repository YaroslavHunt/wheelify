import { SettingsForm } from '@/features/user/components'
import { type Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Profile settings',
}

export default function SettingsPage() {
	return <SettingsForm />
}