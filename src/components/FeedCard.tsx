import Image from 'next/image'
import React from 'react'
import { BookReview } from '@/types/book'

/**
 * @description
 * 피드 카드
 */
export default function FeedCard({ data = {} }: { data: BookReview }) {
	const { id, rating, review, createdAt, book = {} } = data || {}
	const { title, author, thumbnail, publisher, publishedDate } = book || {}
	return (
		<div className="p-4 border border-[#444444] rounded-lg">
			<div className="flex flex-row justify-between items-center">
				<div className="flex flex-row justify-start items-center">
					<div className="w-10 h-10 bg-[#333333] rounded-full overflow-hidden flex justify-center items-center"></div>
				</div>
			</div>
		</div>
	)
}
