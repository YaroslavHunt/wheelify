'use client'

import { useTheme } from 'next-themes'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ResetPasswordSchema, TypeResetPasswordSchema } from '@/features/auth/schemes'
import { zodResolver } from '@hookform/resolvers/zod'
import { useResetPasswordMutation } from '@/features/auth/hooks'
import { toast } from 'sonner'
import { AuthWrapper } from '@/features/auth/components/AuthWrapper'
import { Button, Form, FormControl, FormField, FormItem, FormLabel, Input } from '@/shared/components/ui'
import ReCAPTCHA from 'react-google-recaptcha'

export function ResetPasswordForm() {
	const { theme } = useTheme()
	const [recaptchaValue, setRecaptchaValue ] = useState<string|null>(null)

	const form = useForm<TypeResetPasswordSchema>({
		resolver: zodResolver(ResetPasswordSchema),
		defaultValues: {
			email: '',
		}
	})

	const { reset, isLoadingReset } = useResetPasswordMutation()

	const onSubmit = async (data: TypeResetPasswordSchema) => {
		if(recaptchaValue) {
			reset({ values: data, recaptcha: recaptchaValue })
		} else {
			toast.error('Please, complete reCAPTCHA')
		}
	}

	return <AuthWrapper
		heading="Password reset"
		description="Enter your mail to reset the password"
		backButtonLabel="Sign in"
		backButtonHref="login"
	>
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="grid gap-2"
			>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) =>
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									placeholder="mail@example.com"
									disabled={isLoadingReset}
									type="email"
									{...field}
								/>
							</FormControl>
						</FormItem>}
				/>
				<div className='flex justify-center'>
					<ReCAPTCHA
						sitekey={process.env.GOOGLE_RECAPTCHA_SITE_KEY as string}
						onChange={setRecaptchaValue}
						theme={(theme === 'light') ? 'light' : 'dark'}
					/>
				</div>
				<Button
					type="submit"
					className="w-full"
					disabled={isLoadingReset}
				>
					Reset password
				</Button>
			</form>
		</Form>
	</AuthWrapper>
}
