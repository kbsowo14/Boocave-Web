'use client'

import { useScreenSize } from '@/contexts/DeviceContext'
import FeedCard from '@/components/FeedCard'
import MyFollowList from '@/components/MyFollowList'

export default function Home() {
	const { windowWidth = 0 } = useScreenSize()

	// for testing data list
	const feedDataList = [
		{
			id: '1',
			rating: 5,
			review: `스님의 느긋함을 배울 필요가 있다...\n낙원은 '락'이다!\n\n#자기탐구 이또한 지나가리라... #마음공부`,
			createdAt: '2021-01-01',
			userId: '1',
			user_name: 'user1',
			is_liked: true,
			like_count: 3020,
			comment_count: 23,
			is_pinned: true,
			is_following: false,
			book: {
				id: '1',
				title: 'book1',
				author: 'author1',
				thumbnail: 'thumbnail1',
				publisher: 'publisher1',
				publishedDate: 'publishedDate1',
			},
			review_images: ['/review_img_01.png'],
		},
		{
			id: '2',
			rating: 4,
			review: '간단한 리뷰 테스트 입니다!\n\n#테스트 #테스트2',
			createdAt: '2021-01-02',
			userId: '2',
			user_name: 'user2',
			is_liked: false,
			like_count: 245,
			comment_count: 12,
			is_pinned: false,
			is_following: true,
			book: {
				id: '2',
				title: 'book2',
				author: 'author2',
				thumbnail: 'thumbnail2',
				publisher: 'publisher2',
				publishedDate: 'publishedDate2',
			},
			review_images: ['/review_img_02.jpg'],
		},
		{
			id: '3',
			rating: 3,
			review: '간단한 리뷰 테스트 입니다!\n\n#테스트 #테스트2',
			createdAt: '2021-01-03',
			userId: '3',
			user_name: 'user3',
			is_liked: false,
			like_count: 8,
			comment_count: 1,
			is_pinned: false,
			is_following: false,
			book: {
				id: '3',
				title: 'book3',
				author: 'author3',
				thumbnail: 'thumbnail3',
				publisher: 'publisher3',
				publishedDate: 'publishedDate3',
			},
			review_images: ['/review_img_03.jpeg'],
		},
	]

	if (!windowWidth) return
	return (
		<div className="min-h-screen" style={{ width: windowWidth }}>
			{/* 팔로잉 리스트 */}
			<MyFollowList />
			{/* <Carousel
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
			</Carousel> */}

			<div className="grid grid-cols-1 gap-4">
				{feedDataList?.length > 0 &&
					feedDataList?.map(item => <FeedCard key={item.id} data={item} />)}
			</div>
		</div>
	)
}
