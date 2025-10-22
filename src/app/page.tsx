'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { BookSearchInput } from '@/components/BookSearchInput'

export default function Home() {
	const router = useRouter()
	const { data: session, status } = useSession()
	const { name: userName = '' } = session?.user || {}

	/**
	 * @description
	 * 세션이 없을 시 자동으로 로그인 페이지로 이동
	 */
	useEffect(() => {
		if (status === 'unauthenticated') {
			router?.push('/login')
		}
	}, [status, router])

	return (
		<div className="w-full flex justify-center items-center pb-8">
			<div className="w-full">
				<p className="text-center text-white text-sm">{userName}님</p>
				<p className="text-center text-white text-xl font-bold mt-2 mb-8">
					책을 찾고 저와 토론해볼까요?
				</p>
				<BookSearchInput />
			</div>
		</div>
	)
}
