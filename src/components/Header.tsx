'use client'

import Link from 'next/link'
import { FaRegBell } from 'react-icons/fa'
import { RxPencil1 } from 'react-icons/rx'

/**
 * @description
 * 헤더 컴포넌트
 */
export function Header() {
	return (
		<header className="sticky top-0 z-10 border-b-[1px] border-[#222222] bg-[#171717]">
			<div className="px-4">
				<div className="pt-2 pb-4 flex flex-row justify-between items-center">
					<Link
						href="/"
						className="text-lg font-bold flex flex-row justify-start items-center relative"
					>
						<div className="text-[#51CD42]">BOO</div>
						<div className="text-white">CAVE</div>
						<div className="w-[102px] h-[1px] bg-white absolute bottom-[7px] left-[1px]" />
						<RxPencil1 size={18} color="#fff" className="absolute bottom-[5px] left-[100px]" />
					</Link>
					<Link href="/notice" className="text-white">
						<FaRegBell size={18} color="#fff" />
					</Link>
				</div>
			</div>
		</header>
	)
}
