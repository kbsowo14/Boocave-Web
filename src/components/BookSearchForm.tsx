'use client'

import { useState } from 'react'

type BookSearchFormProps = {
	onSearch: (query: string) => void
	loading?: boolean
}

export function BookSearchForm({ onSearch, loading }: BookSearchFormProps) {
	const [query, setQuery] = useState('')

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (query.trim()) {
			onSearch(query.trim())
		}
	}

	return (
		<form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
			<div className="flex gap-2">
				<input
					type="text"
					value={query}
					onChange={e => setQuery(e.target.value)}
					placeholder="읽은 책을 검색해보세요..."
					className="flex-1 px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					disabled={loading}
				/>
				<button
					type="submit"
					disabled={loading || !query.trim()}
					className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{loading ? '검색 중...' : '검색'}
				</button>
			</div>
		</form>
	)
}
