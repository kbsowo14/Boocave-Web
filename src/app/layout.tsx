import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Header } from '@/components/Header'
import { NavBar } from '@/components/NavBar'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Boocave - 나만의 책장',
	description: '읽은 책을 기록하고 독후감을 작성하는 나만의 책장',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="ko">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#171717]`}>
				<Providers>
					<Header />
					{children}
					<NavBar />
				</Providers>
			</body>
		</html>
	)
}
