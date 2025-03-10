import { Html } from '@react-email/html'
import { Body, Heading, Link, Tailwind, Text } from '@react-email/components'
import * as React from 'react'

interface ConfirmationTemplateProps {
	domain: string;
	token: string;
}

export function ConfirmationTemplate({ domain, token }: Readonly<ConfirmationTemplateProps>) {
	const confirmLink = `${domain}/auth/new-verification?token=${token}`

	return (
		<Tailwind>
			<Html>
				{/* eslint-disable-next-line prettier/prettier */}
				<Body className="text-black">
					<Heading>Email Verification</Heading>
					<Text>
						Hello!
						To confirm your email, go to the following link:
					</Text>
					<Link href={confirmLink}>Verify email</Link>
					<Text>
						This link is valid within 1 hour.
						If you have not invited a confirmation, just ignore this message.
					</Text>
					<Text>Thank you for using our platform.</Text>
				</Body>
			</Html>
		</Tailwind>
	)
}