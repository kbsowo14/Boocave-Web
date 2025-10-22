'use client'

import ChatBookInfo from '@/components/ChatBookInfo'
import ChatInput from '@/components/ChatInput'
import ChatMessages from '@/components/ChatMessages'
import axios from 'axios'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

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

export default function Chat() {
	const searchParams = useSearchParams()
	const bookGoogleId = searchParams?.get('bookGoogleId') || ''

	const [currentBookInfo, setCurrentBookInfo] = useState<Book | null>(null)

	const searchBookInfo = async (bookGoogleId: string) => {
		try {
			const response = await axios.get(`/api/books/${bookGoogleId}`)
			setCurrentBookInfo(response.data.book)
		} catch (error) {
			console.warn('searchBookInfo error', error)
		}
	}

	useEffect(() => {
		if (bookGoogleId) {
			searchBookInfo(bookGoogleId)
		}
	}, [bookGoogleId])

	return (
		<div className="w-full">
			{/* Book Info Area */}
			<ChatBookInfo data={currentBookInfo} />

			{/* Messages Area */}
			<ChatMessages />

			{/* Input Area */}
			<div className="w-full fixed bottom-0 flex justify-center items-center p-4">
				<ChatInput />
			</div>
		</div>
	)
}
