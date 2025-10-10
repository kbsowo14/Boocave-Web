import { useScreenSize } from '@/contexts/DeviceContext'
import Image from 'next/image'
import React from 'react'
import { FiPlus } from 'react-icons/fi'

/**
 * @description
 * 내 팔로잉 리스트 (가로 스크롤)
 */
export default function MyFollowList() {
	const { windowWidth = 0 } = useScreenSize()

	const followList = [
		{
			user_name: 'best_friend',
			user_image: '/test_profile_01.jpg',
		},
		{
			user_name: 'hello_world',
			user_image: '/test_profile_02.jpg',
		},
		{
			user_name: 'good_friend',
			user_image: '/test_profile_03.jpg',
		},
		{
			user_name: 'best_friend',
			user_image: '/test_profile_01.jpg',
		},
		{
			user_name: 'hello_world',
			user_image: '/test_profile_02.jpg',
		},
		{
			user_name: 'good_friend',
			user_image: '/test_profile_03.jpg',
		},
		{
			user_name: 'best_friend',
			user_image: '/test_profile_01.jpg',
		},
		{
			user_name: 'hello_world',
			user_image: '/test_profile_02.jpg',
		},
		{
			user_name: 'good_friend',
			user_image: '/test_profile_03.jpg',
		},
	]

	if (!followList?.length) return
	return (
		<div className="overflow-x-auto overflow-y-hidden" style={{ width: windowWidth }}>
			<div className="gap-4 p-4 flex flex-row justify-start items-center">
				{followList?.map((item, index) => {
					return (
						<div
							key={index}
							className="flex flex-col justify-center items-center flex-shrink-0"
						>
							<Image
								src={item?.user_image}
								alt={item?.user_name}
								width={64}
								height={64}
								className="rounded-full overflow-hidden"
							/>
							<p className="text-white text-xs mt-1">{item?.user_name}</p>
						</div>
					)
				})}
				<button
					onClick={() => {
						console.log('친구찾기')
					}}
					className="flex flex-col justify-center items-center flex-shrink-0 pr-4"
				>
					<div className="w-16 h-16 border-[1px] border-white rounded-full flex justify-center items-center">
						<FiPlus size={28} color="#fff" />
					</div>
					<p className="text-white text-xs mt-1">친구찾기</p>
				</button>
			</div>
		</div>
	)
}
