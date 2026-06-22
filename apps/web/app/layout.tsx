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
    'Trikosh — Open-source financial research infrastructure. Standardised historical data for 200+ companies across 6 sectors. Built for students who can\'t afford Bloomberg.',
  openGraph: {
    title: 'Trikosh',
    description: 'Open-source financial research infrastructure. Standardised historical data for 200+ companies across 6 sectors. Built for students who can\'t afford Bloomberg.',
    url: 'https://trikosh.xyz',
    siteName: 'Trikosh',
    type: 'website',
    images: [
      {
        url: 'https://trikosh.xyz/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Trikosh — Financial Research Infrastructure',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trikosh',
    description: 'Open-source financial research infrastructure. Standardised historical data for 200+ companies across 6 sectors.',
    images: ['https://trikosh.xyz/images/og-image.png'],
  },
  metadataBase: new URL('https://trikosh.xyz'),
  manifest: '/manifest.json',
}

// SECURITY: Clerk secret key is server-only. Only publishable key used client-side.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider appearance={{
        variables: { colorPrimary: '#131313' },
        elements: {
          card: { cursor: 'auto' },
          modalContent: { cursor: 'auto' },
          userButtonPopoverCard: { cursor: 'auto' },
          formButtonPrimary: { cursor: 'pointer' },
          socialButtonsBlockButton: { cursor: 'pointer' },
          footerActionLink: { cursor: 'pointer' },
          userButtonTrigger: { cursor: 'pointer' },
        },
      }}>
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
