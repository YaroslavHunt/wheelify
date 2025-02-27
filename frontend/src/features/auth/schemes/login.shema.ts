import { z } from 'zod'

export const LoginSchema = z.object({
	email: z.string()
		.email('Non correct mail format')
		.nonempty('Email is required'),
	password: z.string()
		.min(8, 'Password must be at least 8 characters')
		.nonempty('Password is required'),
	code: z.optional(z.string())
})

export type TypeLoginSchema = z.infer<typeof LoginSchema>;
