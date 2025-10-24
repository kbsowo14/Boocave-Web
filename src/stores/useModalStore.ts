import { create } from 'zustand'
import { ReactNode } from 'react'

interface ModalState {
	isOpen: boolean
	content: ReactNode | null
	title?: string
	onClose?: () => void
	open: (content: ReactNode, options?: { title?: string; onClose?: () => void }) => void
	close: () => void
}

export const useModalStore = create<ModalState>(set => ({
	isOpen: false,
	content: null,
	title: undefined,
	onClose: undefined,
	open: (content, options) =>
		set({
			isOpen: true,
			content,
			title: options?.title,
			onClose: options?.onClose,
		}),
	close: () =>
		set(state => {
			// onClose 콜백이 있으면 실행
			if (state.onClose) {
				state.onClose()
			}
			return {
				isOpen: false,
				content: null,
				title: undefined,
				onClose: undefined,
			}
		}),
}))
