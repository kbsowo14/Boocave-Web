'use client'

import Image from 'next/image'

type BookCardProps = {
	book: {
		googleId: string
		title: string
		author: string
		publisher: string
		publishedDate: string
		description: string
		thumbnail: string
		isbn: string
	}
	onSelect: (book: unknown) => void
}

export function BookCard({ book, onSelect }: BookCardProps) {
	return (
		<div
			onClick={() => onSelect(book)}
			className="flex gap-4 p-4 border border-[#444444] rounded-lg hover:shadow-lg transition-shadow cursor-pointer bg-[#333333]"
		>
			<div className="flex-shrink-0">
				{!!book?.thumbnail ? (
					<Image
						src={book?.thumbnail}
						alt={book?.title || ''}
						className="object-cover rounded"
						width={96}
						height={144}
					/>
				) : (
					<div className="w-24 h-36 bg-[#444444] rounded flex items-center justify-center text-white">
						<span className="text-4xl">📖</span>
					</div>
				)}
			</div>

			<div className="flex-1 min-w-0">
				<h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">{book.title}</h3>
				<p className="text-sm text-white mb-2">{book.author}</p>
				<p className="text-xs text-white mb-2">
					{book.publisher} {book.publishedDate && `· ${book.publishedDate.substring(0, 4)}`}
				</p>
				{book.description && (
					<p className="text-sm text-white line-clamp-3">{book.description}</p>
				)}
			</div>
		</div>
	)
}
