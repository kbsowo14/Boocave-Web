import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * @description 팔로우 추가
 * POST /api/follow
 */
export async function POST(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions)
		if (!session?.user?.id) {
			return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
		}

		const { followingId } = await req.json()

		if (!followingId) {
			return NextResponse.json({ error: 'followingId가 필요합니다.' }, { status: 400 })
		}

		// 자기 자신을 팔로우할 수 없음
		if (session.user.id === followingId) {
			return NextResponse.json({ error: '자기 자신을 팔로우할 수 없습니다.' }, { status: 400 })
		}

		// 이미 팔로우 중인지 확인
		const existingFollow = await prisma.follow.findUnique({
			where: {
				followerId_followingId: {
					followerId: session.user.id,
					followingId: followingId,
				},
			},
		})

		if (existingFollow) {
			return NextResponse.json({ error: '이미 팔로우 중입니다.' }, { status: 400 })
		}

		// 팔로우 생성
		const follow = await prisma.follow.create({
			data: {
				followerId: session.user.id,
				followingId: followingId,
			},
		})

		return NextResponse.json({ success: true, data: follow }, { status: 201 })
	} catch (error) {
		console.error('팔로우 추가 에러:', error)
		return NextResponse.json({ error: '팔로우 추가 중 오류가 발생했습니다.' }, { status: 500 })
	}
}

/**
 * @description 팔로우 삭제 (언팔로우)
 * DELETE /api/follow
 */
export async function DELETE(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions)
		if (!session?.user?.id) {
			return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
		}

		const { searchParams } = new URL(req.url)
		const followingId = searchParams.get('followingId')

		if (!followingId) {
			return NextResponse.json({ error: 'followingId가 필요합니다.' }, { status: 400 })
		}

		// 팔로우 관계 삭제
		const deletedFollow = await prisma.follow.deleteMany({
			where: {
				followerId: session.user.id,
				followingId: followingId,
			},
		})

		if (deletedFollow.count === 0) {
			return NextResponse.json({ error: '팔로우 관계를 찾을 수 없습니다.' }, { status: 404 })
		}

		return NextResponse.json({ success: true }, { status: 200 })
	} catch (error) {
		console.error('언팔로우 에러:', error)
		return NextResponse.json({ error: '언팔로우 중 오류가 발생했습니다.' }, { status: 500 })
	}
}
