import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	try {
		const { messages, bookInfo } = await request.json()

		if (!messages || !Array.isArray(messages) || messages.length === 0) {
			return NextResponse.json({ error: '대화 내용이 필요합니다' }, { status: 400 })
		}

		const apiKey = process.env.OPENAI_API_KEY

		if (!apiKey) {
			return NextResponse.json(
				{ error: 'OpenAI API 키가 설정되지 않았습니다' },
				{ status: 500 }
			)
		}

		// 대화 내용을 요약하는 시스템 메시지
		const systemMessage = {
			role: 'system',
			content: `당신은 독서 토론 내용을 요약하는 전문가입니다. 
다음 책에 대한 사용자와 AI의 대화 내용을 읽고, 독서 리뷰와 별점을 제공해주세요.:

책 정보:
- 제목: ${bookInfo?.title || '알 수 없음'}
- 저자: ${bookInfo?.author || '알 수 없음'}

다음 형식의 JSON으로 응답해주세요:
{
  "rating": 1-5 사이의 숫자 (대화 내용을 분석하여 사용자가 책을 얼마나 좋아하는지 판단),
  "review": "리뷰 내용"
}

리뷰 작성 시 다음 사항을 포함해주세요:
1. 책의 주요 주제와 내용
2. 토론에서 나온 핵심 인사이트
3. 사용자의 주요 의견과 생각
4. 인상 깊었던 점

별점 판단 기준:
- 5점: 매우 긍정적, 강력 추천, 깊은 감동
- 4점: 긍정적, 좋았음, 추천할 만함
- 3점: 보통, 괜찮았음, 중립적
- 2점: 아쉬움, 기대에 못 미침
- 1점: 부정적, 실망스러움

대화 내용에서 사용자의 감정, 평가, 반응을 종합적으로 분석하여 별점을 결정해주세요.
리뷰는 자연스러운 독서 리뷰 형식으로 2-3 문단 정도로 작성해주고, 사용자가 직접 독후감을 작성한 것처럼 작성해주세요.
반드시 JSON 형식으로만 응답하고, 한국어로 작성해주세요.`,
		}

		// OpenAI API 호출
		const response = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify({
				model: 'gpt-4o-mini',
				messages: [systemMessage, ...messages],
				temperature: 0.7,
				max_tokens: 1000,
			}),
		})

		if (!response.ok) {
			const error = await response.json()
			console.error('OpenAI API 오류:', error)
			return NextResponse.json({ error: 'AI 요약 생성에 실패했습니다' }, { status: 500 })
		}

		const data = await response.json()
		const aiResponse = data.choices[0].message.content

		// JSON 응답 파싱
		try {
			// JSON 코드 블록 제거 (```json ... ``` 형식일 경우)
			const cleanedResponse = aiResponse
				.replace(/```json\n?/g, '')
				.replace(/```\n?/g, '')
				.trim()
			const parsed = JSON.parse(cleanedResponse)

			const rating = Math.max(1, Math.min(5, parseInt(parsed.rating) || 4)) // 1-5 사이로 제한, 기본값 4
			const review = parsed.review || aiResponse

			return NextResponse.json({ rating, review })
		} catch (parseError) {
			// JSON 파싱 실패 시 전체를 리뷰로 사용하고 기본 별점 4점
			console.error('JSON 파싱 오류:', parseError)
			return NextResponse.json({
				rating: 4,
				review: aiResponse,
			})
		}
	} catch (error) {
		console.error('요약 API 오류:', error)
		return NextResponse.json({ error: '요약 처리 중 오류가 발생했습니다' }, { status: 500 })
	}
}
