'use client'

import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { DeviceProvider } from '@/contexts/DeviceContext'

export function Providers({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(() => new QueryClient())

	return (
		<SessionProvider>
			<QueryClientProvider client={queryClient}>
				<DeviceProvider>{children}</DeviceProvider>
			</QueryClientProvider>
		</SessionProvider>
	)
}
