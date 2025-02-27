'use client'

import { useTheme } from 'next-themes'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { NewPasswordSchema, TypeNewPasswordSchema } from '@/features/auth/schemes'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNewPasswordMutation } from '@/features/auth/hooks'
import { toast } from 'sonner'
import { AuthWrapper } from '@/features/auth/components/AuthWrapper'
import { Button, Form, FormControl, FormField, FormItem, FormLabel, Input } from '@/shared/components/ui'
import ReCAPTCHA from 'react-google-recaptcha'

export function NewPasswordForm() {
	const { theme } = useTheme()
	const [recaptchaValue, setRecaptchaValue ] = useState<string|null>(null)

	const form = useForm<TypeNewPasswordSchema>({
		resolver: zodResolver(NewPasswordSchema),
		defaultValues: {
			password: '',
		}
	})

	const { newPassword, isLoadingNew } = useNewPasswordMutation()

	const onSubmit = async (data: TypeNewPasswordSchema) => {
		if(recaptchaValue) {
			newPassword({ values: data, recaptcha: recaptchaValue })
		} else {
			toast.error('Please, complete reCAPTCHA')
		}
	}

	return <AuthWrapper
		heading="New password"
		description="Come up with a new password for your account"
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
					name="password"
					render={({ field }) =>
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input
									placeholder="********"
									disabled={isLoadingNew}
									type="password"
									autoComplete="off"
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
					disabled={isLoadingNew}
				>
					Continue
				</Button>
			</form>
		</Form>
	</AuthWrapper>
}
