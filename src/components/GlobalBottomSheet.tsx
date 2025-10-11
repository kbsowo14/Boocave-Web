'use client'

import BottomSheet from './BottomSheet'
import { useBottomSheetStore } from '@/stores/useBottomSheetStore'

/**
 * @description
 * 전역에서 사용할 수 있는 바텀시트 컴포넌트
 * Zustand 스토어를 통해 어디서든 열고 닫을 수 있습니다.
 */
export default function GlobalBottomSheet() {
	const { isOpen, title, content, height, close } = useBottomSheetStore()

	return (
		<BottomSheet isOpen={isOpen} onClose={close} title={title} height={height}>
			{content}
		</BottomSheet>
	)
}
