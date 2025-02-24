'use client'

import { type PropsWithChildren } from 'react'
import { TanstackQueryProvider } from '@/shared/providers/TanstackQueryProvider'
import { ThemeProvider } from './ThemeProvider'
import { ToastProvider } from '@/shared/providers'

export function MainProvider({ children }: PropsWithChildren<unknown>) {
	return (
		<TanstackQueryProvider>
			<ThemeProvider
				attribute='class'
				defaultTheme='light'
				disableTransitionOnChange
				storageKey='wheelify-theme'
			>
				<
					ToastProvider />
				{children}
			</ThemeProvider>
		</TanstackQueryProvider>
	)
}