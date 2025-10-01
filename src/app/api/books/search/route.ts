import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams
	const query = searchParams.get('q')

	if (!query) {
		return NextResponse.json({ error: '검색어를 입력해주세요' }, { status: 400 })
	}

	try {
		const response = await fetch(
			`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20&langRestrict=ko`
		)

		if (!response.ok) {
			throw new Error('도서 검색에 실패했습니다')
		}

		const data = await response.json()

		// Google Books API 응답을 우리 형식에 맞게 변환
		const books =
			data.items?.map((item: any) => ({
				googleId: item.id,
				title: item.volumeInfo.title,
				author: item.volumeInfo.authors?.join(', ') || '작자 미상',
				publisher: item.volumeInfo.publisher || '',
				publishedDate: item.volumeInfo.publishedDate || '',
				description: item.volumeInfo.description || '',
				thumbnail: item.volumeInfo.imageLinks?.thumbnail || '',
				isbn: item.volumeInfo.industryIdentifiers?.[0]?.identifier || '',
			})) || []

		return NextResponse.json({ books })
	} catch (error) {
		console.error('도서 검색 오류:', error)
		return NextResponse.json({ error: '도서 검색 중 오류가 발생했습니다' }, { status: 500 })
	}
}
