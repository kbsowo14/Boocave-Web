import Image from 'next/image'
import React from 'react'

type Book = {
	googleId: string
	title: string
	author: string
	publisher: string
	publishedDate: string
	description: string
	thumbnail: string
	isbn: string
}

export default function ChatBookInfo({ data }: { data: Book | null }) {
	if (!data) return null
	return (
		<div className="w-full flex flex-col items-center justify-center p-8">
			<Image src={data?.thumbnail || ''} alt={data?.title || ''} width={60} height={80} />
			<p className="text-sm text-white font-bold text-center py-2">{data?.title}</p>
			<p className="text-sm text-white text-center">{data?.author}</p>
			<p className="text-sm text-white text-center">{data?.publisher}</p>
		</div>
	)
}
