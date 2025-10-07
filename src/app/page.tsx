'use client'

import Image from 'next/image'
import { Carousel } from 'react-responsive-carousel'
import { useDevice, useScreenSize } from '@/contexts/DeviceContext'
import FeedCard from '@/components/FeedCard'

export default function Home() {
	const { isWebView } = useDevice()
	const { windowWidth = 0, windowHeight = 0 } = useScreenSize()

	// for testing data list
	const feedDataList = [
		{
			id: '1',
			rating: 5,
			review: 'review1',
			createdAt: '2021-01-01',
			book: {
				id: '1',
				title: 'book1',
				author: 'author1',
				thumbnail: 'thumbnail1',
				publisher: 'publisher1',
				publishedDate: 'publishedDate1',
			},
		},
		{
			id: '2',
			rating: 4,
			review: 'review2',
			createdAt: '2021-01-02',
			book: {
				id: '2',
				title: 'book2',
				author: 'author2',
				thumbnail: 'thumbnail2',
				publisher: 'publisher2',
				publishedDate: 'publishedDate2',
			},
		},
		{
			id: '3',
			rating: 3,
			review: 'review3',
			createdAt: '2021-01-03',
			book: {
				id: '3',
				title: 'book3',
				author: 'author3',
				thumbnail: 'thumbnail3',
				publisher: 'publisher3',
				publishedDate: 'publishedDate3',
			},
		},
	]

	if (!windowWidth) return
	return (
		<div className="min-h-screen" style={{ width: windowWidth }}>
			{/* 디바이스 정보 표시 (개발용) */}
			{isWebView && (
				<div className="mb-4 p-2 bg-gray-800 rounded text-xs text-gray-400">
					웹뷰 환경 | 크기: {windowWidth}x{windowHeight}
				</div>
			)}

			<Carousel
				showArrows={false}
				showThumbs={false}
				showStatus={false}
				showIndicators={false}
				infiniteLoop={true}
				autoPlay={true}
				interval={3000}
			>
				<div className="relative w-full h-[320px]">
					<Image src="/land-01.png" alt="land-01" fill className="object-contain" />
				</div>
				<div className="relative w-full h-[320px]">
					<Image src="/land-02.png" alt="land-02" fill className="object-contain" />
				</div>
			</Carousel>

			<div className="grid grid-cols-1 gap-4 px-4">
				{feedDataList?.length > 0 &&
					feedDataList?.map(item => <FeedCard key={item.id} data={item} />)}
			</div>
		</div>
	)
}
