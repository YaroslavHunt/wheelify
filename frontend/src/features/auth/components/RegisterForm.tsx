'use client'

import { AuthWrapper } from '@/features/auth/components/AuthWrapper'
import { useForm } from 'react-hook-form'
import { RegisterSchema, TypeRegisterSchema } from '@/features/auth/schemes'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@/shared/components/ui'
import { useState } from 'react'
import { useTheme } from 'next-themes'
import ReCAPTCHA from 'react-google-recaptcha'
import { toast } from 'sonner'
import { useRegisterMutation } from '@/features/auth/hooks'

export function RegisterForm() {
	const { theme } = useTheme()
	const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)

	const form = useForm<TypeRegisterSchema>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			username: '',
			email: '',
			password: '',
			passwordRepeat: ''
		}
	})

	const { register, isLoadingRegister } = useRegisterMutation()

	const onSubmit = (data: TypeRegisterSchema) => {
		if (recaptchaValue) {
			register({ values: data, recaptcha: recaptchaValue })
		} else {
			toast.error('Please, complete reCAPTCHA')
		}
	}

	return <AuthWrapper
		heading="Sign Up"
		description="Enter your email address and password"
		backButtonLabel="Already have an account? Sign In"
		backButtonHref="login"
		isShowSocial
	>
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="grid gap-2"
			>
				<FormField
					control={form.control}
					name="username"
					render={({ field }) =>
						<FormItem>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input
									placeholder="nickname or name"
									disabled={isLoadingRegister}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>}
				/>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) =>
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									placeholder="mail@example.com"
									disabled={isLoadingRegister}
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
									disabled={isLoadingRegister}
									type="password"
									autoComplete="off"
									{...field}
								/>
							</FormControl>
						</FormItem>}
				/>
				<FormField
					control={form.control}
					name="passwordRepeat"
					render={({ field }) =>
						<FormItem>
							<FormLabel>Confirm your password</FormLabel>
							<FormControl>
								<Input
									placeholder="********"
									disabled={isLoadingRegister}
									type="password"
									autoComplete="off"
									{...field}
								/>
							</FormControl>
						</FormItem>}
				/>
				<div className="flex justify-center">
					<ReCAPTCHA
						sitekey={process.env.GOOGLE_RECAPTCHA_SITE_KEY as string}
						onChange={setRecaptchaValue}
						theme={(theme === 'light') ? 'light' : 'dark'}
					/>
				</div>
				<Button type="submit" className="w-full" disabled={isLoadingRegister}>
					Create account
				</Button>
			</form>
		</Form>
	</AuthWrapper>
}