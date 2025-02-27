'use client'

import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Form, FormControl, FormDescription,
	FormField,
	FormItem,
	FormLabel, FormMessage, Input,
	Loading, Switch
} from '@/shared/components/ui'
import { useProfile } from '@/shared/hooks'
import { UserButton, UserButtonLoading } from '@/features/user/components/UserButton'
import { SettingsSchema, TypeSettingsSchema } from '@/features/user/schemes'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUpdateProfileMutation } from '@/features/user/hooks/useUpdateProfileMutation'

export function SettingsForm() {
	const { user, isLoading } = useProfile()
	const form = useForm<TypeSettingsSchema>({
		resolver: zodResolver(SettingsSchema),
		values: {
			username: user?.username || '',
			firstname: user?.firstname || '',
			lastname: user?.lastname || '',
			email: user?.email || '',
			phone: user?.phone || '',
			// avatar: user?.avatar || '',
			isTwoFactorEnabled: user?.isTwoFactorEnabled || false
		}
	})

	const { update, isLoadingUpdate } = useUpdateProfileMutation()

	const onSubmit = (values: TypeSettingsSchema ) => {
		update(values)
	}

	if (!user) return null

	return <Card className="w-[400px]">
		<CardHeader className="flex flex-row items-center justify-between">
			<CardTitle>Profile settings</CardTitle>
			{ isLoading ? <UserButtonLoading /> : <UserButton user={user} />}
		</CardHeader>
		<CardContent>
			{ isLoading
				? <Loading />
				: (
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className='grid gap-7 space-y-2'
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
												disabled={isLoadingUpdate}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>}
							/>
							<FormField
								control={form.control}
								name="firstname"
								render={({ field }) =>
									<FormItem>
										<FormLabel>Firstname</FormLabel>
										<FormControl>
											<Input
												disabled={isLoadingUpdate}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>}
							/>
							<FormField
								control={form.control}
								name="lastname"
								render={({ field }) =>
									<FormItem>
										<FormLabel>Lastname</FormLabel>
										<FormControl>
											<Input
												disabled={isLoadingUpdate}
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
												disabled={isLoadingUpdate}
												type="email"
												{...field}
											/>
										</FormControl>
									</FormItem>}
							/>
							<FormField
								control={form.control}
								name="phone"
								render={({ field }) =>
									<FormItem>
										<FormLabel>Phone</FormLabel>
										<FormControl>
											<Input
												placeholder="+380*********"
												disabled={isLoadingUpdate}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>}
							/>
							<FormField
								control={form.control}
								name="isTwoFactorEnabled"
								render={({ field }) =>
									<FormItem
										className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'
									>
										<FormLabel>2FA</FormLabel>
										<FormDescription>
											Enable a two-factor authentication for your profile
										</FormDescription>
										<FormControl>
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</FormItem>}
							/>
							<Button type='submit' disabled={isLoadingUpdate}>Save</Button>
						</form>
					</Form>
				)}
		</CardContent>
	</Card>
}
