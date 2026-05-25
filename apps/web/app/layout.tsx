import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import TrustStrip from '@/components/layout/TrustStrip'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-serif',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'Trikosh', template: '%s · Trikosh' },
  description:
    'Open-source financial research infrastructure. Standardised data for 50 companies across Financial Services, AI & Technology, and Healthcare. Free for students and CFA candidates.',
  openGraph: {
    title: 'Trikosh',
    description: 'Open financial research infrastructure for serious students.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${playfair.variable} ${inter.variable} ${GeistMono.variable}`}
      >
        <body style={{ fontFamily: 'var(--font-sans)', backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>
          <Navbar />
          <main style={{ minHeight: 'calc(100vh - 56px)' }}>
            {children}
          </main>
          <TrustStrip />
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  )
}
