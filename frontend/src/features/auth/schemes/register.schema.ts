import { z } from 'zod'

export const RegisterSchema = z.object({
	username: z.string()
		.min(3, 'Please, enter your username. Username must be at least 3 characters')
		.nonempty('Username is required'),
	email: z.string()
		.email('Non correct mail format')
		.nonempty('Email is required'),
	password: z.string()
		.min(8, 'Password must be at least 8 characters')
		.nonempty('Password is required'),
	passwordRepeat: z.string()
		.min(8, 'The confirmation password must be at least 8 characters')
		.nonempty('Please enter your confirmation password'),
})
	.refine(data =>
	data.password === data.passwordRepeat,
	{message: 'Passwords do not match', path: ['passwordRepeat']
	});

export type TypeRegisterSchema = z.infer<typeof RegisterSchema>;
