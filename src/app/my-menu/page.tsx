'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import Image from 'next/image'
import { useMemo } from 'react'
import { FaAngleRight } from 'react-icons/fa'

export default function MyMenu() {
	const { data: session, status } = useSession()
	const { image: userImage = '', name: userName = '' } = session?.user || {}

	// 디버깅: 세션 정보 확인
	console.log('세션 상태:', status)
	console.log('세션 데이터:', session)
	console.log('사용자 이미지:', userImage)
	console.log('사용자 이름:', userName)

	const menuList = useMemo(
		() => [
			{
				label: !!userName ? '로그아웃' : '로그인',
				onPress: () => {
					if (!!userName) {
						signOut()
					} else {
						signIn('google')
					}
				},
			},
		],
		[userName]
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
		<div>
			{/* Profile */}
			{!userName ? (
				<button
					className="px-4 py-6 flex flex-row justify-start items-center"
					onClick={() => signIn('google')}
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
							className="w-full flex flex-row justify-between items-center px-6 py-4 border-b-[1px] border-white/20"
							onClick={onPress}
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
