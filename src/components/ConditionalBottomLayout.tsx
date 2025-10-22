'use client'

import { usePathname } from 'next/navigation'
import { NavBar } from './NavBar'

export function ConditionalBottomLayout() {
	const pathname = usePathname()

	// Blacklist
	if (['/login', '/chat']?.indexOf(pathname) !== -1) {
		return null
	}

	return (
		<>
			<NavBar />
		</>
	)
}
