'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useDeviceDimensions } from '@/hooks/useDeviceDimensions'

interface DeviceDimensions {
	windowWidth: number
	windowHeight: number
}

interface DeviceContextValue {
	dimensions: DeviceDimensions
	isWebView: boolean
	isReady: boolean
}

const DeviceContext = createContext<DeviceContextValue | undefined>(undefined)

interface DeviceProviderProps {
	children: ReactNode
}

export function DeviceProvider({ children }: DeviceProviderProps) {
	const deviceData = useDeviceDimensions()

	return <DeviceContext.Provider value={deviceData}>{children}</DeviceContext.Provider>
}

export function useDevice() {
	const context = useContext(DeviceContext)
	if (context === undefined) {
		throw new Error('useDevice must be used within a DeviceProvider')
	}
	return context
}

// 편의 훅들
export function useIsWebView() {
	const { isWebView } = useDevice()
	return isWebView
}

export function useScreenSize() {
	const { dimensions } = useDevice()
	return dimensions
}

export function useIsMobile() {
	const { dimensions } = useDevice()
	return dimensions.windowWidth < 768
}

export function useIsTablet() {
	const { dimensions } = useDevice()
	return dimensions.windowWidth >= 768 && dimensions.windowWidth < 1024
}

export function useIsDesktop() {
	const { dimensions } = useDevice()
	return dimensions.windowWidth >= 1024
}
