'use client'

import { usePathname } from 'next/navigation'
import { Header } from './Header'

export function ConditionalHeaderLayout() {
	const pathname = usePathname()

	// login 페이지에서는 Header와 NavBar를 숨김
	if (pathname === '/login') {
		return null
	}

	return (
		<>
			<Header />
		</>
	)
}
