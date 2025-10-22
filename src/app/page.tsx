'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { BookSearchInput } from '@/components/BookSearchInput'
import { GiBlackBook } from 'react-icons/gi'

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

	if (status !== 'authenticated') return null
	return (
		<div className="w-full flex justify-center items-center pb-8">
			<div className="w-full">
				<p className="text-center text-white text-base">{userName}님</p>
				<p className="text-center text-white text-3xl font-bold mt-2 mb-4 leading-11">
					최근에 읽었던 책으로
					<br />
					대화해 볼까요?
				</p>

				{/* 책과 말풍선 애니메이션 */}
				<div className="flex justify-center items-center mb-8 relative h-20">
					{/* 왼쪽 말풍선 (초록색) */}
					<div className="absolute left-1/2 ml-8 mb-4 animate-bubble-left">
						<div className="bg-[#51CD42] text-white text-xs px-3 py-2 rounded-2xl rounded-bl-none relative">
							안녕?
						</div>
					</div>

					{/* 책 아이콘 */}
					<div className="z-10">
						<GiBlackBook size={40} color="#fff" />
					</div>

					{/* 오른쪽 말풍선 (하얀색) */}
					<div className="absolute right-1/2 mr-8 mb-8 animate-bubble-right">
						<div className="bg-white text-gray-800 text-xs px-3 py-2 rounded-2xl rounded-br-none relative">
							반가워!
						</div>
					</div>
				</div>

				<BookSearchInput />
			</div>

			<style jsx>{`
				@keyframes bubbleLeft {
					0%,
					100% {
						opacity: 0;
						transform: translateY(10px) scale(0.8);
					}
					40%,
					60% {
						opacity: 1;
						transform: translateY(0) scale(1);
					}
				}

				@keyframes bubbleRight {
					0%,
					40% {
						opacity: 0;
						transform: translateY(10px) scale(0.8);
					}
					50%,
					90% {
						opacity: 1;
						transform: translateY(0) scale(1);
					}
					100% {
						opacity: 0;
						transform: translateY(10px) scale(0.8);
					}
				}

				:global(.animate-bubble-left) {
					animation: bubbleLeft 3s ease-in-out infinite;
				}

				:global(.animate-bubble-right) {
					animation: bubbleRight 3s ease-in-out infinite;
				}
			`}</style>
		</div>
	)
}
