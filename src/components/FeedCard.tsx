import Image from 'next/image'
import React from 'react'
import { BookReview } from '@/types/book'
import { useScreenSize } from '@/contexts/DeviceContext'
import { IoMdMore } from 'react-icons/io'
import { BiLike, BiSolidLike } from 'react-icons/bi'
import { FaRegComment } from 'react-icons/fa'
import { MdOutlineShare } from 'react-icons/md'
import { AiOutlinePushpin, AiFillPushpin } from 'react-icons/ai'
import FeedCardText from '@/components/FeedCardText'
import dayjs from 'dayjs'

/**
 * @description
 * 피드 카드
 */
export default function FeedCard({ data = {} }: { data: BookReview }) {
	const { windowWidth = 0 } = useScreenSize()

	const {
		id,
		rating,
		review,
		createdAt,
		book = {},
		review_images = [],
		user_name = '',
		is_liked = false,
		like_count = 0,
		comment_count = 0,
		is_pinned = false,
		is_following = false,
	} = data || {}
	const { title, author, thumbnail, publisher, publishedDate } = book || {}

	if (!windowWidth) return null
	return (
		<div className="flex flex-col justify-center items-center border-t-[1px] border-[#444444]">
			{/* User Info Area */}
			<div className="flex flex-row justify-between items-center w-full p-4">
				<div className="flex flex-row justify-start items-center">
					<div className="w-10 h-10 bg-[#333333] rounded-full overflow-hidden flex justify-center items-center"></div>
					<span className="text-white text-sm ml-2">{user_name}</span>
					{!is_following && (
						<button
							onClick={() => {
								console.log('팔로우')
							}}
							className="ml-2 flex items-center justify-center border-[1px] border-[#ffffff] text-white text-xs px-2 py-1 rounded-md"
						>
							팔로우
						</button>
					)}
				</div>
				<button
					className="flex items-center justify-center"
					onClick={() => {
						console.log('more')
					}}
				>
					<IoMdMore size={24} color="#fff" />
				</button>
			</div>

			{/* Image Area */}
			<div className="relative" style={{ width: windowWidth, height: windowWidth }}>
				<Image
					src={(review_images?.[0] as string) || ''}
					alt={title || ''}
					fill
					className="object-cover"
				/>
			</div>

			{/* Buttons Area */}
			<div className="w-full p-4 flex flex-row justify-between items-center">
				{/* Like & Comments & Share Buttons */}
				<div className="flex flex-row justify-between items-center gap-3">
					<button className="flex flex-row justify-start items-center">
						{is_liked ? (
							<BiSolidLike size={22} color="#51CD42" />
						) : (
							<BiLike size={22} color="#fff" />
						)}
						<span className="text-white text-xs ml-1">{like_count || 0}</span>
					</button>
					<button className="flex flex-row justify-start items-center">
						<FaRegComment size={22} color="#fff" />
						<span className="text-white text-xs ml-1">{comment_count || 0}</span>
					</button>
					<button className="flex flex-row justify-start items-center">
						<MdOutlineShare size={22} color="#fff" />
					</button>
				</div>

				{/* Pin Button */}
				<button className="flex items-center justify-center">
					{is_pinned ? (
						<AiFillPushpin size={22} color="#51CD42" />
					) : (
						<AiOutlinePushpin size={22} color="#fff" />
					)}
				</button>
			</div>

			{/* Contents Area */}
			<div className="w-full px-4 pb-2">
				<FeedCardText
					text={review || ''}
					hashtagColor="#51CD42"
					className="text-white text-sm whitespace-pre-wrap"
				/>
			</div>

			{/* Date Area */}
			<div className="w-full px-4 pb-2">
				<p className="text-white/50 text-xs">{dayjs(createdAt).format('M월 D일')}</p>
			</div>
		</div>
	)
}
