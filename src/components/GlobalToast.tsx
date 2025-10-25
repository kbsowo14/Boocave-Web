'use client'

import React, { useEffect, useRef } from 'react'
import { useToastStore } from '@/stores/useToastStore'

export default function GlobalToast() {
	const { isVisible, content, hideToast } = useToastStore()
	const timeoutRef = useRef<NodeJS.Timeout | null>(null)

	useEffect(() => {
		if (isVisible && content) {
			// 기존 타이머가 있다면 클리어
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}

			// 3초 후 자동으로 사라지도록 설정
			timeoutRef.current = setTimeout(() => {
				hideToast()
			}, 3000)
		}

		// 컴포넌트 언마운트 시 타이머 클리어
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}
		}
	}, [isVisible, content, hideToast])

	// 토스트가 보이지 않으면 렌더링하지 않음
	if (!isVisible || !content) {
		return null
	}

	return (
		<div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
			<div className="bg-black/80 text-white px-4 py-3 rounded-lg max-w-sm mx-4 pointer-events-auto">
				{typeof content === 'string' ? <p className="text-center">{content}</p> : content}
			</div>
		</div>
	)
}
