'use client'

import Image from 'next/image'
import { Carousel } from 'react-responsive-carousel'
import { useDevice, useIsMobile, useScreenSize } from '@/contexts/DeviceContext'

export default function Home() {
	const { isWebView } = useDevice()
	const isMobile = useIsMobile()
	const { windowWidth, windowHeight } = useScreenSize()

	// 디바이스 크기에 따른 캐러셀 크기 계산
	const carouselWidth = isMobile ? windowWidth : Math.min(windowWidth, 400)
	const carouselHeight = isMobile ? Math.min(windowHeight * 0.3, 200) : 200

	return (
		<div className="min-h-screen w-full">
			{/* 디바이스 정보 표시 (개발용) */}
			{isWebView && (
				<div className="mb-4 p-2 bg-gray-800 rounded text-xs text-gray-400">
					웹뷰 환경 | 크기: {windowWidth}x{windowHeight} | 모바일: {isMobile ? '예' : '아니오'}
				</div>
			)}

			<div className="relative" style={{ width: carouselWidth, height: carouselHeight }}>
				<Carousel
					showArrows={!isMobile}
					showThumbs={false}
					showStatus={false}
					infiniteLoop={true}
					autoPlay={true}
					interval={3000}
				>
					<div>
						<Image
							src="/land-01.png"
							alt="land-01"
							width={carouselWidth}
							height={carouselHeight}
							className="object-cover"
						/>
					</div>
					<div>
						<Image
							src="/land-02.png"
							alt="land-02"
							width={carouselWidth}
							height={carouselHeight}
							className="object-cover"
						/>
					</div>
				</Carousel>
			</div>
		</div>
	)
}
