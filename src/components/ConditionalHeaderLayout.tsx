'use client'

import { usePathname } from 'next/navigation'
import { Header } from './Header'
import { useSession } from 'next-auth/react'

export function ConditionalHeaderLayout() {
	const pathname = usePathname()
	const { status } = useSession()

	// login 페이지에서는 Header와 NavBar를 숨김
	if (pathname === '/login' || status !== 'authenticated') {
		return null
	}

	return (
		<>
			<Header />
		</>
	)
}
