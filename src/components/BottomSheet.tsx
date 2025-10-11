'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { useScreenSize } from '@/contexts/DeviceContext'

interface BottomSheetProps {
	isOpen: boolean
	onClose: () => void
	children: React.ReactNode
	title?: string
	height?: number | string // 'auto', 숫자(px), '50%' 등
}

export default function BottomSheet({
	isOpen,
	onClose,
	children,
	title,
	height = 'auto',
}: BottomSheetProps) {
	const { windowHeight = 0 } = useScreenSize()

	// ESC 키로 닫기
	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose()
		}
		if (isOpen) {
			window.addEventListener('keydown', handleEsc)
			// 배경 스크롤 방지
			document.body.style.overflow = 'hidden'
		}
		return () => {
			window.removeEventListener('keydown', handleEsc)
			document.body.style.overflow = 'unset'
		}
	}, [isOpen, onClose])

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* 배경 오버레이 */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
						onClick={onClose}
						className="fixed inset-0 bg-black/50 z-40"
					/>

					{/* 바텀시트 */}
					<motion.div
						initial={{ y: '100%' }}
						animate={{ y: 0 }}
						exit={{ y: '100%' }}
						transition={{
							type: 'spring',
							damping: 30,
							stiffness: 300,
						}}
						drag="y"
						dragConstraints={{ top: 0, bottom: 0 }}
						dragElastic={0.2}
						onDragEnd={(_, info) => {
							// 150px 이상 아래로 드래그하면 닫기
							if (info.offset.y > 150) {
								onClose()
							}
						}}
						className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] rounded-t-3xl z-50 shadow-xl"
						style={{
							maxHeight: windowHeight * 0.9,
							height: height,
						}}
					>
						{/* 드래그 핸들 */}
						<div className="flex justify-center pt-3 pb-2">
							<div className="w-12 h-1 bg-gray-600 rounded-full" />
						</div>

						{/* 헤더 */}
						{title && (
							<div className="px-6 py-3 border-b border-gray-700">
								<h3 className="text-white text-lg font-semibold">{title}</h3>
							</div>
						)}

						{/* 콘텐츠 */}
						<div className="overflow-y-auto max-h-full">{children}</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	)
}
