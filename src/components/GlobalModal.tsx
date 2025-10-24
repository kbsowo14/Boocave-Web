'use client'

import { useModalStore } from '@/stores/useModalStore'
import { useEffect } from 'react'

export default function GlobalModal() {
	const { isOpen, content, title, close } = useModalStore()

	// ESC 키로 모달 닫기
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && isOpen) {
				close()
			}
		}

		if (isOpen) {
			document.addEventListener('keydown', handleKeyDown)
			// 모달이 열릴 때 body 스크롤 방지
			document.body.style.overflow = 'hidden'
		}

		return () => {
			document.removeEventListener('keydown', handleKeyDown)
			document.body.style.overflow = 'unset'
		}
	}, [isOpen, close])

	if (!isOpen || !content) return null

	return (
		<div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
			<div
				className="bg-[#222222] rounded-lg p-6 w-80 max-w-[90vw] max-h-[90vh] overflow-y-auto"
				onClick={e => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않도록
			>
				{title && <h3 className="text-white text-lg font-bold mb-4">{title}</h3>}
				{content}
			</div>
		</div>
	)
}
