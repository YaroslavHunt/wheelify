import { z } from 'zod'

export const SettingsSchema = z.object({
	username: z.string()
		.min(3, 'Please, enter your username. Username must be at least 3 characters'),
	firstname: z.string()
		.min(3, 'Please, enter your username. Username must be at least 3 characters'),
	lastname: z.string()
		.min(3, 'Please, enter your username. Username must be at least 3 characters'),
	email: z.string()
		.email('Non correct mail format'),
	phone: z.string()
		.min(12, 'Phone must be at least 8 characters'), //TODO regex
	// avatar: z.string(), // TODO file buffer
	isTwoFactorEnabled: z.boolean()
})

export type TypeSettingsSchema = z.infer<typeof SettingsSchema>;
