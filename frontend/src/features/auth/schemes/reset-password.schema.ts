import { z } from 'zod'

export const ResetPasswordSchema = z.object({
	email: z.string()
		.email('Non correct mail format')
		.nonempty('Email is required')
})

export type TypeResetPasswordSchema = z.infer<typeof ResetPasswordSchema>;
