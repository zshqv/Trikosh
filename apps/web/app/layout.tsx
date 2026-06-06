import type { Metadata } from 'next'
import { Bodoni_Moda, DM_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import TrustStrip from '@/components/layout/TrustStrip'
import PageTransition from '@/components/PageTransition'
import CustomCursor from '@/components/effects/CustomCursor'
import LoadingScreen from '@/components/effects/LoadingScreen'

const bodoniModa = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  style: ['normal'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
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

// SECURITY: Clerk secret key is server-only. Only publishable key used client-side.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${bodoniModa.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
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
