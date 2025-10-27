import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type Params = {
	params: Promise<{
		id: string
	}>
}

// 특정 리뷰 수정
export async function PATCH(request: NextRequest, context: Params) {
	try {
		const session = await getServerSession(authOptions)

		if (!session?.user?.id) {
			return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 })
		}

		const { id } = await context.params
		const body = await request.json()
		const { review } = body

		// 리뷰가 존재하고 본인의 리뷰인지 확인
		const existingReview = await prisma.bookReview.findUnique({
			where: { id },
		})

		if (!existingReview) {
			return NextResponse.json({ error: '리뷰를 찾을 수 없습니다' }, { status: 404 })
		}

		if (existingReview.userId !== session.user.id) {
			return NextResponse.json({ error: '권한이 없습니다' }, { status: 403 })
		}

		// 리뷰 수정
		const updatedReview = await prisma.bookReview.update({
			where: { id },
			data: {
				review,
			},
			include: {
				book: true,
			},
		})

		return NextResponse.json({ review: updatedReview })
	} catch (error) {
		console.error('리뷰 수정 오류:', error)
		return NextResponse.json({ error: '리뷰 수정 중 오류가 발생했습니다' }, { status: 500 })
	}
}

// 특정 리뷰 삭제
export async function DELETE(request: NextRequest, context: Params) {
	try {
		const session = await getServerSession(authOptions)

		if (!session?.user?.id) {
			return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 })
		}

		const { id } = await context.params

		// 리뷰가 존재하고 본인의 리뷰인지 확인
		const existingReview = await prisma.bookReview.findUnique({
			where: { id },
		})

		if (!existingReview) {
			return NextResponse.json({ error: '리뷰를 찾을 수 없습니다' }, { status: 404 })
		}

		if (existingReview.userId !== session.user.id) {
			return NextResponse.json({ error: '권한이 없습니다' }, { status: 403 })
		}

		// 리뷰 삭제
		await prisma.bookReview.delete({
			where: { id },
		})

		return NextResponse.json({ message: '리뷰가 삭제되었습니다' })
	} catch (error) {
		console.error('리뷰 삭제 오류:', error)
		return NextResponse.json({ error: '리뷰 삭제 중 오류가 발생했습니다' }, { status: 500 })
	}
}
