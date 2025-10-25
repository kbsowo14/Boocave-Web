'use client'

import { create } from 'zustand'

interface ToastState {
	isVisible: boolean
	content: string | React.ReactNode | null
	showToast: (content: string | React.ReactNode) => void
	hideToast: () => void
}

export const useToastStore = create<ToastState>(set => ({
	isVisible: false,
	content: null,
	showToast: content => set({ isVisible: true, content }),
	hideToast: () => set({ isVisible: false, content: null }),
}))
