import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
	try {
		const { messages, bookInfo } = await request.json()

		if (!messages || !Array.isArray(messages)) {
			return new Response(JSON.stringify({ error: '메시지가 필요합니다' }), { status: 400 })
		}

		const apiKey = process.env.OPENAI_API_KEY

		if (!apiKey) {
			return new Response(JSON.stringify({ error: 'OpenAI API 키가 설정되지 않았습니다' }), {
				status: 500,
			})
		}

		// 책 정보를 시스템 메시지로 추가
		const systemMessage = {
			role: 'system',
			content: bookInfo
				? `당신은 독서 토론 파트너입니다. 다음 책에 대해 사용자와 깊이 있는 토론을 나누세요:

제목: ${bookInfo.title}
저자: ${bookInfo.author}
출판사: ${bookInfo.publisher}
출판일: ${bookInfo.publishedDate}
설명: ${bookInfo.description}

사용자의 의견을 경청하고, 책의 내용과 연관지어 질문하고, 통찰력 있는 대화를 이끌어주세요. 한국어로 답변해주세요.`
				: '당신은 독서 토론 파트너입니다. 사용자와 책에 대해 깊이 있는 대화를 나누세요. 한국어로 답변해주세요.',
		}

		// OpenAI API 호출 (스트리밍 모드)
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
				stream: true, // 스트리밍 활성화
			}),
		})

		if (!response.ok) {
			const error = await response.json()
			console.error('OpenAI API 오류:', error)
			return new Response(JSON.stringify({ error: 'AI 응답 생성에 실패했습니다' }), {
				status: 500,
			})
		}

		// 스트리밍 응답을 클라이언트로 전달
		const stream = new ReadableStream({
			async start(controller) {
				const reader = response.body?.getReader()
				const decoder = new TextDecoder()

				if (!reader) {
					controller.close()
					return
				}

				try {
					while (true) {
						const { done, value } = await reader.read()
						if (done) break

						const chunk = decoder.decode(value)
						const lines = chunk.split('\n').filter(line => line.trim() !== '')

						for (const line of lines) {
							const message = line.replace(/^data: /, '')
							if (message === '[DONE]') {
								controller.close()
								return
							}

							try {
								const parsed = JSON.parse(message)
								const content = parsed.choices[0]?.delta?.content

								if (content) {
									controller.enqueue(new TextEncoder().encode(content))
								}
							} catch {
								// JSON 파싱 에러 무시
							}
						}
					}
				} catch (error) {
					console.error('스트리밍 오류:', error)
					controller.error(error)
				} finally {
					controller.close()
				}
			},
		})

		return new Response(stream, {
			headers: {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				Connection: 'keep-alive',
			},
		})
	} catch (error) {
		console.error('채팅 API 오류:', error)
		return new Response(JSON.stringify({ error: '채팅 처리 중 오류가 발생했습니다' }), {
			status: 500,
		})
	}
}
