import { NextRequest, NextResponse } from 'next/server'

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params

	if (!id) {
		return NextResponse.json({ error: 'Book ID가 필요합니다' }, { status: 400 })
	}

	try {
		// Google Books API로 특정 볼륨 조회
		const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`)

		if (!response.ok) {
			throw new Error('책을 찾을 수 없습니다')
		}

		const item = await response.json()

		// 우리 형식에 맞게 변환
		const book = {
			googleId: item.id,
			title: item.volumeInfo?.title || '',
			author: item.volumeInfo?.authors?.join(', ') || '작자 미상',
			publisher: item.volumeInfo?.publisher || '',
			publishedDate: item.volumeInfo?.publishedDate || '',
			description: item.volumeInfo?.description || '',
			thumbnail: item.volumeInfo?.imageLinks?.thumbnail || '',
			isbn: item.volumeInfo?.industryIdentifiers?.[0]?.identifier || '',
		}

		return NextResponse.json({ book })
	} catch (error) {
		console.error('책 조회 오류:', error)
		return NextResponse.json({ error: '책 조회 중 오류가 발생했습니다' }, { status: 500 })
	}
}
