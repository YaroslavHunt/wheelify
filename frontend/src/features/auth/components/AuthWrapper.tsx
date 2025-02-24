import { type PropsWithChildren } from 'react'
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui'
import Link from 'next/link'
import { AuthSocial } from '@/features/auth/components/AuthSocial'

interface AuthWrapperProps {
	heading: string
	description?: string
	backButtonLabel?: string
	backButtonHref?: string
	isShowSocial?: boolean
}

export function AuthWrapper({
								children,
								heading,
								description,
								backButtonLabel,
								backButtonHref,
								isShowSocial = false
							}: PropsWithChildren<AuthWrapperProps>) {
	return (
		<Card>
			<CardHeader className="space-y-2">
				<CardTitle>{heading}</CardTitle>
				{description && (
					<CardDescription>{description}</CardDescription>
				)}
			</CardHeader>
			<CardContent className="space-y-2">
				{children}
				{isShowSocial && <AuthSocial />}
			</CardContent>
			<CardFooter className="space-y-2">
				{backButtonLabel && backButtonHref && (
					<Button variant='link' className='w-full font-normal'>
						<Link href={backButtonHref}>{backButtonLabel}</Link>
					</Button>
				)}
			</CardFooter>
		</Card>
	)
}
