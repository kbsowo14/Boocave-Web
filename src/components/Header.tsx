'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

export function Header() {
	const { data: session, status } = useSession()
	const loading = status === 'loading'

	return (
		<header className="border-b border-gray-200 bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<Link href="/" className="text-2xl font-bold text-gray-900">
						북케이브
					</Link>

					<nav className="flex items-center gap-6">
						{session?.user ? (
							<>
								<Link
									href="/my-library"
									className="text-gray-700 hover:text-gray-900 font-medium"
								>
									내 책장
								</Link>
								<div className="flex items-center gap-3">
									{session.user.image && (
										<img
											src={session.user.image}
											alt={session.user.name || '사용자'}
											className="w-8 h-8 rounded-full"
										/>
									)}
									<span className="text-sm text-gray-700">{session.user.name}</span>
									<button
										onClick={() => signOut()}
										className="text-sm text-gray-600 hover:text-gray-900"
									>
										로그아웃
									</button>
								</div>
							</>
						) : (
							<button
								onClick={() => signIn('google')}
								disabled={loading}
								className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
							>
								{loading ? '로딩 중...' : '로그인'}
							</button>
						)}
					</nav>
				</div>
			</div>
		</header>
	)
}
