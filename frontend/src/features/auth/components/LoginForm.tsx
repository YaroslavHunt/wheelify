'use client'

import { AuthWrapper } from '@/features/auth/components/AuthWrapper'
import { useForm } from 'react-hook-form'
import { LoginSchema, TypeLoginSchema } from '@/features/auth/schemes'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@/shared/components/ui'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import { toast } from 'sonner'
import ReCAPTCHA from 'react-google-recaptcha'

export function LoginForm() {
	const { theme } = useTheme()
	const [recaptchaValue, setRecaptchaValue ] = useState<string|null>(null)

	const form = useForm<TypeLoginSchema>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
			password: '',
		}
	})

	const onSubmit = async (data: TypeLoginSchema) => {
		if(recaptchaValue) {
			console.log(data)
		} else {
			toast.error('Please, complete reCAPTCHA')
		}
	}

	return <AuthWrapper
		heading="Sign In"
		description="Enter your email address and password"
		backButtonLabel="There is no account yet? Sign Up"
		backButtonHref="register"
		isShowSocial
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
									type="email"
									{...field}
								/>
							</FormControl>
						</FormItem>}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) =>
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input
									placeholder="********"
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
				<Button type="submit" className="w-full">
					Sign in
				</Button>
			</form>
		</Form>
	</AuthWrapper>
}