'use client'

import { type PropsWithChildren } from 'react'
import { TanstackQueryProvider } from '@/shared/providers/TanstackQueryProvider'
import { ThemeProvider } from './ThemeProvider'

export function MainProvider({ children }: PropsWithChildren<unknown>) {
	return (
		<TanstackQueryProvider>
			<ThemeProvider
				attribute='class'
				defaultTheme='light'
				disableTransitionOnChange
				storageKey='wheelify-theme'
			>{children}</ThemeProvider>
		</TanstackQueryProvider>
	)
}