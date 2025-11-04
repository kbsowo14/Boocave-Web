'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { FaAngleRight } from 'react-icons/fa'

export default function MyMenu() {
	const router = useRouter()
	const { data: session, status } = useSession()
	const { image: userImage = '', name: userName = '' } = session?.user || {}
	const [isLoggingOut, setIsLoggingOut] = useState(false)

	const menuList = useMemo(
		() => [
			{
				label: '로그아웃',
				onPress: async () => {
					try {
						setIsLoggingOut(true)
						await signOut({ callbackUrl: '/login' })
					} catch (error) {
						console.error('로그아웃 오류:', error)
						setIsLoggingOut(false)
					}
				},
			},
			// {
			// 	label: '환경설정',
			// 	onPress: () => {
			// 		router.push('/setting')
			// 	},
			// },
		],
		[]
	)

	// 로딩 중일 때
	if (status === 'loading') {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<p className="text-white">로딩 중...</p>
			</div>
		)
	}

	return (
		<div className="w-full min-h-screen relative">
			{/* 로그아웃 중 전체 화면 로딩 */}
			{isLoggingOut && (
				<div className="fixed inset-0 bg-black/70 flex flex-col justify-center items-center z-50">
					<div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
				</div>
			)}

			{/* Profile */}
			{!userName ? (
				<button
					className="px-4 py-6 flex flex-row justify-start items-center"
					onClick={() => signIn('google', { callbackUrl: '/' })}
				>
					<div className="w-16 h-16 bg-[#333333] rounded-full overflow-hidden flex justify-center items-center"></div>
					<p className="ml-4 text-white text-base font-bold">로그인을 해주세요.</p>
				</button>
			) : (
				<div className="px-4 py-6 flex flex-row justify-start items-center">
					<div className="w-16 h-16 bg-[#333333] rounded-full overflow-hidden flex justify-center items-center">
						{!!userImage && <Image src={userImage} alt="my-menu" width={100} height={100} />}
					</div>
					<div className="ml-4">
						<p className="text-white font-bold text-lg">{userName}</p>
						<div className="flex flex-row justify-start items-center gap-1.5 mt-0.5">
							<p className="text-white text-xs">팔로워 0</p>
							<div className="w-[2px] h-[2px] bg-white rounded-full" />
							<p className="text-white text-xs">팔로잉 0</p>
						</div>
					</div>
				</div>
			)}

			{/* Summery */}
			<div className="px-4 flex flex-row justify-around items-center w-full">
				<div className="flex flex-col justify-start items-center gap-1">
					<p className="text-white text-lg font-bold">0</p>
					<p className="text-white text-xs font-bold">별점</p>
				</div>
				<div className="flex flex-col justify-start items-center gap-1">
					<p className="text-white text-lg font-bold">0</p>
					<p className="text-white text-xs font-bold">리뷰</p>
				</div>
				<div className="flex flex-col justify-start items-center gap-1">
					<p className="text-white text-lg font-bold">0</p>
					<p className="text-white text-xs font-bold">도서</p>
				</div>
				<div className="flex flex-col justify-start items-center gap-1">
					<p className="text-white text-lg font-bold">0</p>
					<p className="text-white text-xs font-bold">댓글</p>
				</div>
			</div>

			{/* Menu */}
			<div className="w-full border-t-[1px] border-white/20 mt-8">
				{menuList.map((menu, index) => {
					const { label = '', onPress = () => {} } = menu || {}
					return (
						<button
							key={index}
							className="w-full flex flex-row justify-between items-center px-6 py-4 border-b-[1px] border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
							onClick={onPress}
							disabled={isLoggingOut}
						>
							<p className="text-white text-sm">{label}</p>
							<FaAngleRight size={16} color="#fff" />
						</button>
					)
				})}
			</div>
		</div>
	)
}
