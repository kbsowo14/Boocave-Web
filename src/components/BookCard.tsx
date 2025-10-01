'use client'

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
	onSelect: (book: any) => void
}

export function BookCard({ book, onSelect }: BookCardProps) {
	return (
		<div
			onClick={() => onSelect(book)}
			className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow cursor-pointer bg-white"
		>
			<div className="flex-shrink-0">
				{book.thumbnail ? (
					<img
						src={book.thumbnail}
						alt={book.title}
						className="w-24 h-36 object-cover rounded"
					/>
				) : (
					<div className="w-24 h-36 bg-gray-200 rounded flex items-center justify-center text-gray-400">
						<span className="text-4xl">📖</span>
					</div>
				)}
			</div>

			<div className="flex-1 min-w-0">
				<h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">{book.title}</h3>
				<p className="text-sm text-gray-600 mb-2">{book.author}</p>
				<p className="text-xs text-gray-500 mb-2">
					{book.publisher} {book.publishedDate && `· ${book.publishedDate.substring(0, 4)}`}
				</p>
				{book.description && (
					<p className="text-sm text-gray-700 line-clamp-3">{book.description}</p>
				)}
			</div>
		</div>
	)
}
