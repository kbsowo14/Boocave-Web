import { create } from 'zustand'
import { ReactNode } from 'react'

interface BottomSheetState {
	isOpen: boolean
	title?: string
	content: ReactNode | null
	height?: number | string
	open: (content: ReactNode, options?: { title?: string; height?: number | string }) => void
	close: () => void
}

export const useBottomSheetStore = create<BottomSheetState>(set => ({
	isOpen: false,
	title: undefined,
	content: null,
	height: 'auto',
	open: (content, options) =>
		set({
			isOpen: true,
			content,
			title: options?.title,
			height: options?.height || 'auto',
		}),
	close: () =>
		set({
			isOpen: false,
			content: null,
			title: undefined,
			height: 'auto',
		}),
}))
