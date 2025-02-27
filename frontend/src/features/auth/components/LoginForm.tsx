'use client'

import { AuthWrapper } from '@/features/auth/components/AuthWrapper'
import { useForm } from 'react-hook-form'
import { LoginSchema, TypeLoginSchema } from '@/features/auth/schemes'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Form, FormControl, FormField, FormItem, FormLabel, Input } from '@/shared/components/ui'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import { toast } from 'sonner'
import ReCAPTCHA from 'react-google-recaptcha'
import { useLoginMutation } from '../hooks'
import Link from 'next/link'

export function LoginForm() {
	const { theme } = useTheme()
	const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)
	const [isShowTwoFactor, setIsShowTwoFactor] = useState(false)

	const form = useForm<TypeLoginSchema>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	})

	const { login, isLoadingLogin } = useLoginMutation(setIsShowTwoFactor)

	const onSubmit = async (data: TypeLoginSchema) => {
		if (recaptchaValue) {
			login({ values: data, recaptcha: recaptchaValue })
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
				{isShowTwoFactor && (
					<FormField
						control={form.control}
						name="code"
						render={({ field }) =>
							<FormItem>
								<FormLabel>Code</FormLabel>
								<FormControl>
									<Input
										placeholder="123456"
										disabled={isLoadingLogin}
										{...field}
									/>
								</FormControl>
							</FormItem>}
					/>
				)}
				{!isShowTwoFactor && (
					<>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) =>
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											placeholder="mail@example.com"
											disabled={isLoadingLogin}
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
									<div className="flex items-center justify-between">
										<FormLabel>Password</FormLabel>
										<Link href="/auth/reset-password"
											  className="ml-auto inline-block text-sm underline"
										>
											Forgot password?
										</Link>
									</div>
									<FormControl>
										<Input
											placeholder="********"
											disabled={isLoadingLogin}
											type="password"
											autoComplete="off"
											{...field}
										/>
									</FormControl>
								</FormItem>}
						/>
					</>
				)}
				<div className="flex justify-center">
					<ReCAPTCHA
						sitekey={process.env.GOOGLE_RECAPTCHA_SITE_KEY as string}
						onChange={setRecaptchaValue}
						theme={(theme === 'light') ? 'light' : 'dark'}
					/>
				</div>
				<Button
					type="submit"
					className="w-full"
					disabled={isLoadingLogin}
				>
					Sign in
				</Button>
			</form>
		</Form>
	</AuthWrapper>
}