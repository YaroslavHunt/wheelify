import { Html } from '@react-email/html'
import { Body, Heading, Tailwind, Text, Link } from '@react-email/components'
import * as React from 'react'

interface TwoFactorAuthTemplateProps {
	token: string
}

export function TwoFactorAuthTemplate({ token }: Readonly<TwoFactorAuthTemplateProps>) {
	return (
		<Tailwind>
			<Html>
				{/* eslint-disable-next-line prettier/prettier */}
				<Body className="bg-gray-50 text-black font-sans p-8">
					<div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg">
						<Heading className="text-2xl font-bold text-center text-blue-600 mb-6">
							Two-Factor Authentication
						</Heading>
						<Text className="text-lg mb-4">
							Your two-factor authentication code is:
						</Text>
						<Text className="text-2xl font-bold text-center text-blue-500 mb-6">
							<strong>{token}</strong>
						</Text>
						<Text className="mb-4 text-sm">
							Please enter this code in the app to complete the authentication process.
						</Text>
						<div className="mt-8 text-center text-sm text-gray-500">
							<div className="mb-4">
								<Text>
									If you did not request this code, please ignore this message.
								</Text>
							</div>
							<div className="mb-4">
								<Text>
									Thank you for using our platform. If you need help, feel free to{' '}
									<Link href={`mailto:${process.env.MAIL_FROM}`} className="text-blue-500">
										contact us.
									</Link>
								</Text>
							</div>
						</div>
					</div>
				</Body>
			</Html>
		</Tailwind>
	)
}
