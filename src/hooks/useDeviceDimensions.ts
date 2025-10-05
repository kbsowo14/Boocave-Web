'use client'

import { useEffect, useState, useCallback } from 'react'

interface DeviceDimensions {
	windowWidth: number
	windowHeight: number
}

interface DeviceDimensionsMessage {
	type: 'DEVICE_DIMENSIONS'
	windowWidth: number
	windowHeight: number
}

export function useDeviceDimensions() {
	const [dimensions, setDimensions] = useState<DeviceDimensions>({
		windowWidth: 0,
		windowHeight: 0,
	})
	const [isWebView, setIsWebView] = useState(false)

	const handleMessage = useCallback((event: MessageEvent) => {
		try {
			const data: DeviceDimensionsMessage = JSON.parse(event.data)

			if (data.type === 'DEVICE_DIMENSIONS') {
				setDimensions({
					windowWidth: data.windowWidth,
					windowHeight: data.windowHeight,
				})
				setIsWebView(true)
			}
		} catch (error) {
			// JSON 파싱 실패 시 무시 (다른 메시지일 수 있음)
			console.debug('Failed to parse device dimensions message:', error)
		}
	}, [])

	useEffect(() => {
		// 웹뷰 환경 감지
		const isInWebView =
			window.navigator.userAgent.includes('wv') ||
			window.navigator.userAgent.includes('WebView') ||
			(window as { ReactNativeWebView?: unknown }).ReactNativeWebView

		if (isInWebView) {
			setIsWebView(true)
			window.addEventListener('message', handleMessage)
		} else {
			// 일반 브라우저에서는 window 크기 사용
			const updateDimensions = () => {
				setDimensions({
					windowWidth: window.innerWidth,
					windowHeight: window.innerHeight,
				})
			}

			updateDimensions()
			window.addEventListener('resize', updateDimensions)

			return () => {
				window.removeEventListener('resize', updateDimensions)
			}
		}

		return () => {
			window.removeEventListener('message', handleMessage)
		}
	}, [handleMessage])

	return {
		dimensions,
		isWebView,
		isReady: dimensions.windowWidth > 0 && dimensions.windowHeight > 0,
	}
}
