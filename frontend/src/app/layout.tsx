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
        {/* Global background — student/lessons override with their own layout */}
        <div
          className="fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=3432&auto=format&fit=crop')` }}
        />
        <div className="fixed inset-0 -z-20 bg-[#0a0a0f]/82" />

        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  )
}

