import { Html } from '@react-email/html'
import { Body, Heading, Link, Tailwind, Text } from '@react-email/components'
import * as React from 'react'

interface ResetPasswordTemplateProps {
	domain: string;
	token: string;
}

export function ResetPasswordTemplate({ domain, token }: Readonly<ResetPasswordTemplateProps>) {
	const resetLink = `${domain}/auth/new-password?token=${token}`

	return (
		<Tailwind>
			<Html>
				{/* eslint-disable-next-line prettier/prettier */}
				<Body className="text-black">
					<Heading>Reset Password</Heading>
					<Text>
						Hello!
						You invited password reset.
						Please go to the following link for create new password:
					</Text>
					<Link href={resetLink}>Confirm password reset</Link>
					<Text>
						This link is valid within 1 hour.
						If you have not invited a password reset, just ignore this message.
					</Text>
					<Text>Thank you for using our platform.</Text>
				</Body>
			</Html>
		</Tailwind>
	)
}