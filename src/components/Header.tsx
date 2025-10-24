'use client'

import { useModalStore } from '@/stores/useModalStore'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { FaRegBell } from 'react-icons/fa'
import { RxPencil1 } from 'react-icons/rx'

/**
 * @description
 * 헤더 컴포넌트
 */
export function Header() {
	const { data: session } = useSession()
	const { image: userImage = '' } = session?.user || {}
	const { open: openModal, close: closeModal } = useModalStore()

	const notificationModalContent = (
		<div className="flex flex-col justify-center items-center w-full">
			<button
				onClick={() => closeModal()}
				className="w-full px-4 py-2 bg-[#51CD42] font-bold text-white rounded-lg hover:bg-[#45b838]"
			>
				확인
			</button>
		</div>
	)

	return (
		<>
			<header className="fixed top-0 z-10 border-b-[1px] border-[#222222] bg-[#171717] h-16 w-full flex justify-center items-center px-4">
				<div className="flex flex-row justify-between items-center w-full">
					<Link
						href="/"
						className="text-lg font-bold flex flex-row justify-start items-center relative"
					>
						<div className="text-[#51CD42]">BOO</div>
						<div className="text-white">CAVE</div>
						<div className="w-[102px] h-[1px] bg-white absolute bottom-[7px] left-[1px]" />
						<RxPencil1 size={18} color="#fff" className="absolute bottom-[5px] left-[100px]" />
					</Link>
					<div className="flex flex-row justify-end items-center">
						<Link
							href="/my-menu"
							className="flex justify-center items-center h-6 w-6 border-[1px] border-white rounded-full mr-3 overflow-hidden"
						>
							{!!userImage && <Image src={userImage} alt="user-image" width={24} height={24} />}
						</Link>
						<div
							className="text-white"
							onClick={() => openModal(notificationModalContent, { title: '준비중 입니다...' })}
						>
							<FaRegBell size={20} color="#fff" />
						</div>
					</div>
				</div>
			</header>
		</>
	)
}
