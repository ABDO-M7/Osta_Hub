import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { Providers } from '@/components/providers'
import { Navbar } from '@/components/layout/Navbar'

const neofolia = localFont({
  src: './fonts/neofolia.woff2',
  variable: '--font-neofolia',
})

const behance = localFont({
  src: './fonts/behance.otf',
  variable: '--font-behance',
})

const droid = localFont({
  src: './fonts/droid.otf',
  variable: '--font-droid',
})

export const metadata: Metadata = {
  title: 'NeuroTron',
  description: 'Interactive learning and AI-powered exam grading',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased ${neofolia.variable} ${behance.variable} ${droid.variable}`}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  )
}

