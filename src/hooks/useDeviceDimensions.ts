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

interface LogMessage {
	type: 'LOG'
	data: {
		level: 'log' | 'warn' | 'error' | 'info'
		message: string
	}
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
		setIsWebView(true)
		window.addEventListener('message', handleMessage)

		// 웹뷰에서 console.log를 React Native로 전달하도록 설정
		const originalConsole = {
			log: console.log,
			warn: console.warn,
			error: console.error,
		}

		const sendLogToRN = (level: 'log' | 'warn' | 'error', ...args: unknown[]) => {
			try {
				const message = args
					.map(arg => {
						if (typeof arg === 'object') {
							try {
								return JSON.stringify(arg, null, 2)
							} catch {
								return String(arg)
							}
						}
						return String(arg)
					})
					.join(' ')

				const logMessage: LogMessage = {
					type: 'LOG',
					data: {
						level,
						message,
					},
				}

				// React Native로 메시지 전송 (안전 캐스팅 사용)
				type WebViewBridge = { ReactNativeWebView?: { postMessage: (data: string) => void } }
				const rnw = (window as unknown as WebViewBridge).ReactNativeWebView
				rnw?.postMessage(JSON.stringify(logMessage))
			} catch (error) {
				originalConsole.error('Failed to send log to React Native:', error)
			}
		}

		// console 메서드들 오버라이드
		console.log = (...args: unknown[]) => {
			originalConsole.log(...args)
			sendLogToRN('log', ...args)
		}

		console.warn = (...args: unknown[]) => {
			originalConsole.warn(...args)
			sendLogToRN('warn', ...args)
		}

		console.error = (...args: unknown[]) => {
			originalConsole.error(...args)
			sendLogToRN('error', ...args)
		}

		return () => {
			// 리스너 제거
			window.removeEventListener('message', handleMessage)

			// console 메서드 복원
			console.log = originalConsole.log
			console.warn = originalConsole.warn
			console.error = originalConsole.error
		}
	}, [handleMessage])

	return {
		dimensions,
		isWebView,
		isReady: dimensions.windowWidth > 0 && dimensions.windowHeight > 0,
	}
}
