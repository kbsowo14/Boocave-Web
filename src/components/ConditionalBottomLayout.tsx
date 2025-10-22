'use client'

import { usePathname } from 'next/navigation'
import { NavBar } from './NavBar'
import { useSession } from 'next-auth/react'

export function ConditionalBottomLayout() {
	const pathname = usePathname()
	const { status } = useSession()

	// Blacklist
	if (['/login', '/chat']?.indexOf(pathname) !== -1 || status !== 'authenticated') {
		return null
	}

	return (
		<>
			<NavBar />
		</>
	)
}
