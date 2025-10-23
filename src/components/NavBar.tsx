'use client'

import Link from 'next/link'
import { useMemo, useEffect, useState } from 'react'
import { MdOutlineCollectionsBookmark } from 'react-icons/md'
import { LuBrain } from 'react-icons/lu'
import { usePathname } from 'next/navigation'
import { CgProfile } from 'react-icons/cg'
import axios from 'axios'
import { useSession } from 'next-auth/react'

export function NavBar() {
	const pathname = usePathname()
	const { status } = useSession()

	const [reviewCount, setReviewCount] = useState(0)

	const fetchReviewCount = async () => {
		try {
			const response = await axios.get('/api/reviews')
			setReviewCount(response.data.reviews?.length || 0)
		} catch (error) {
			console.error('리뷰 개수 조회 실패:', error)
		}
	}

	// 리뷰 개수 가져오기
	useEffect(() => {
		// 인증된 상태일 때만 API 호출
		if (status === 'authenticated') {
			fetchReviewCount()
		}
	}, [pathname, status])

	const navItems = useMemo(() => {
		return [
			{
				isBeta: true,
				icon: (
					<LuBrain
						size={25}
						color={['/', '/chat', '/search']?.indexOf(pathname) !== -1 ? '#51CD42' : '#fff'}
					/>
				),
				label: '독서톡톡',
				href: '/',
			},
			{
				isBeta: false,
				count: reviewCount,
				icon: (
					<MdOutlineCollectionsBookmark
						size={24}
						color={['/my-library']?.indexOf(pathname) !== -1 ? '#51CD42' : '#fff'}
					/>
				),
				label: '내서재',
				href: '/my-library',
			},
			{
				isBeta: false,
				count: 0,
				icon: (
					<CgProfile
						size={28}
						color={['/my-menu']?.indexOf(pathname) !== -1 ? '#51CD42' : '#fff'}
					/>
				),
				label: '마이메뉴',
				href: '/my-menu',
			},
		]
	}, [pathname, reviewCount])

	return (
		<>
			<div className="fixed bottom-0 left-0 right-0 bg-[#333333] flex flex-row justify-around items-center py-2 border-t-[1px] border-[#444444]">
				{navItems?.map(({ icon, label, href, isBeta = false, count = 0 }, index) => (
					<Link
						href={href}
						className="flex flex-col justify-start items-center relative"
						key={index}
					>
						<div className="w-8 h-8 justify-center items-center flex">{icon}</div>
						{isBeta && (
							<div className="rounded-full bg-[#8d1cc1] px-1.5 absolute -top-0.5 -right-2 flex justify-center items-center">
								<span className="text-white text-[8px] font-bold">Beta</span>
							</div>
						)}
						{count > 0 && (
							<div className="rounded-full bg-red-400 min-w-[18px] h-[18px] px-1 absolute -top-0.5 -right-2 flex justify-center items-center">
								<span className="text-white text-[10px] font-bold">
									{count > 99 ? '99+' : count}
								</span>
							</div>
						)}
						<div className="text-white text-[10px] font-bold mt-1">{label}</div>
					</Link>
				))}
			</div>
		</>
	)
}
