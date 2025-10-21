import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// 사용자의 모든 리뷰 조회
export async function GET() {
	try {
		const session = await getServerSession(authOptions)

		if (!session?.user?.id) {
			return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 })
		}

		const reviews = await prisma.bookReview.findMany({
			where: {
				userId: session.user.id,
			},
			include: {
				book: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		})

		return NextResponse.json({ reviews })
	} catch (error) {
		console.error('리뷰 조회 오류:', error)
		return NextResponse.json({ error: '리뷰 조회 중 오류가 발생했습니다' }, { status: 500 })
	}
}

// 새 리뷰 생성
export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions)

		if (!session?.user?.id) {
			return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 })
		}

		const body = await request.json()
		const { bookData, rating, review } = body

		// 별점 유효성 검사
		if (!rating || rating < 1 || rating > 5) {
			return NextResponse.json({ error: '별점은 1~5 사이의 값이어야 합니다' }, { status: 400 })
		}

		// 리뷰 내용 유효성 검사
		if (!review || review.trim().length === 0) {
			return NextResponse.json({ error: '리뷰 내용을 입력해주세요' }, { status: 400 })
		}

		// 책이 DB에 있는지 확인, 없으면 생성
		let book = await prisma.book.findUnique({
			where: { googleId: bookData.googleId },
		})

		if (!book) {
			book = await prisma.book.create({
				data: {
					googleId: bookData.googleId,
					title: bookData.title,
					author: bookData.author,
					publisher: bookData.publisher,
					publishedDate: bookData.publishedDate,
					description: bookData.description,
					thumbnail: bookData.thumbnail,
					isbn: bookData.isbn,
				},
			})
		}

		// 리뷰 생성 (upsert로 중복 방지)
		const bookReview = await prisma.bookReview.upsert({
			where: {
				bookId_userId: {
					bookId: book.id,
					userId: session.user.id,
				},
			},
			update: {
				rating,
				review,
			},
			create: {
				bookId: book.id,
				userId: session.user.id,
				rating,
				review,
			},
			include: {
				book: true,
			},
		})

		return NextResponse.json({ review: bookReview }, { status: 201 })
	} catch (error) {
		console.error('리뷰 생성 오류:', error)
		return NextResponse.json({ error: '리뷰 저장 중 오류가 발생했습니다' }, { status: 500 })
	}
}
