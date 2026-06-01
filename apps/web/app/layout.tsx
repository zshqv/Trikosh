import type { Metadata } from 'next'
import { Urbanist } from 'next/font/google'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import TrustStrip from '@/components/layout/TrustStrip'
import PageTransition from '@/components/PageTransition'
import CustomCursor from '@/components/effects/CustomCursor'
import LoadingScreen from '@/components/effects/LoadingScreen'

const urbanist = Urbanist({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'Trikosh', template: '%s · Trikosh' },
  description:
    'Open-source financial research infrastructure. Standardised data for 100+ companies across Financial Services, AI & Technology, and Healthcare. Free for students and CFA candidates.',
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
        className={`${urbanist.variable} ${GeistMono.variable}`}
      >
        <body style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>
          <LoadingScreen />
          <CustomCursor />
          <Navbar />
          <main style={{ minHeight: 'calc(100vh - var(--nav-h))' }}>
            <PageTransition>{children}</PageTransition>
          </main>
          <TrustStrip />
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  )
}
