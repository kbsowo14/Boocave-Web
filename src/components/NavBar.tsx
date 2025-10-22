'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo } from 'react'
import { MdOutlineCollectionsBookmark } from 'react-icons/md'
import { LuBrain } from 'react-icons/lu'

export function NavBar() {
	const navItems = useMemo(
		() => [
			{
				icon: <LuBrain size={25} color="#fff" />,
				label: '독서톡톡',
				href: '/',
			},
			{
				icon: <MdOutlineCollectionsBookmark size={24} color="#fff" />,
				label: '내서재',
				href: '/my-library',
			},
		],
		[]
	)

	return (
		<>
			<div className="fixed bottom-0 left-0 right-0 bg-[#333333] flex flex-row justify-around items-center py-2 border-t-[1px] border-[#444444]">
				{navItems?.map(({ icon, label, href }, index) => (
					<Link href={href} className="flex flex-col justify-start items-center" key={index}>
						{label === '마이메뉴' ? (
							<div className="w-8 h-8 bg-white rounded-full overflow-hidden flex justify-center items-center">
								{!icon ? (
									<div className="w-8 h-8 rounded-full overflow-hidden flex justify-center items-center border-[2px] border-white relative">
										<div className="w-2 h-2 rounded-full bg-white absolute top-1" />
										<div className="w-5 h-5 bg-white rounded-full absolute top-3.5" />
									</div>
								) : typeof icon === 'string' ? (
									<Image
										src={icon}
										alt={label}
										className="rounded-full object-cover"
										width={32}
										height={32}
									/>
								) : (
									icon
								)}
							</div>
						) : (
							<div className="w-8 h-8 justify-center items-center flex">{icon}</div>
						)}
						<div className="text-white text-[10px] font-bold mt-1">{label}</div>
					</Link>
				))}
			</div>
		</>
	)
}
