import { z } from 'zod'

export const NewPasswordSchema = z.object({
	password: z.string()
		.min(8, 'Password must be at least 8 characters')
		.nonempty('Password is required')
})

export type TypeNewPasswordSchema = z.infer<typeof NewPasswordSchema>;
