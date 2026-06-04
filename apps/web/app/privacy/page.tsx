'use client'

export default function PrivacyPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ borderBottom: '1px solid #444748', padding: 'clamp(56px, 8vw, 96px) 0 clamp(48px, 7vw, 80px)' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 32px' }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: '#8e9192',
            marginBottom: '20px',
          }}>
            Last updated: June 2026
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 700,
            color: '#e5e2e1',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            marginBottom: '24px',
          }}>
            Privacy Policy
          </h1>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '16px',
            color: '#c4c7c8',
            lineHeight: 1.75,
            maxWidth: '672px',
            margin: 0,
          }}>
            Trikosh is built on a simple principle: your data is yours. We collect only what is strictly necessary to run the platform and never sell, trade, or share it with third parties.
          </p>
        </div>
      </section>

      {/* What we collect */}
      <section style={{ borderBottom: '1px solid #444748', padding: 'clamp(48px, 7vw, 80px) 0' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 32px' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(20px, 2.5vw, 28px)',
            fontWeight: 700,
            color: '#e5e2e1',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            marginBottom: '20px',
          }}>
            What we collect
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '16px',
            color: '#c4c7c8',
            lineHeight: 1.75,
            maxWidth: '672px',
            marginBottom: '28px',
          }}>
            When you create an account, we collect your email address and basic profile information (name, profile photo if provided) solely for authentication and account management purposes. We do not collect payment information, browsing history beyond what Clerk&apos;s session management requires, or any sensitive personal data.
          </p>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '16px',
            color: '#c4c7c8',
            lineHeight: 1.75,
            maxWidth: '672px',
            margin: 0,
          }}>
            We do not use tracking pixels, sell data to advertisers, or build behavioural profiles. The only cookies set are authentication session cookies required for Clerk to keep you signed in.
          </p>
        </div>
      </section>

      {/* Authentication */}
      <section style={{ borderBottom: '1px solid #444748', padding: 'clamp(48px, 7vw, 80px) 0' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 32px' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(20px, 2.5vw, 28px)',
            fontWeight: 700,
            color: '#e5e2e1',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            marginBottom: '20px',
          }}>
            Authentication
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '16px',
            color: '#c4c7c8',
            lineHeight: 1.75,
            maxWidth: '672px',
            marginBottom: '16px',
          }}>
            Trikosh uses <a
              href="https://clerk.com/legal/privacy"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#e5e2e1', textDecoration: 'underline', textUnderlineOffset: '3px' }}
            >Clerk</a> for all authentication. Clerk handles the sign-up, sign-in, and session management flows. Your credentials are never stored directly on Trikosh servers — Clerk processes and stores them in accordance with their own privacy policy (SOC 2 Type II compliant).
          </p>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '16px',
            color: '#c4c7c8',
            lineHeight: 1.75,
            maxWidth: '672px',
            margin: 0,
          }}>
            You can review Clerk&apos;s full privacy policy at <a
              href="https://clerk.com/legal/privacy"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#e5e2e1', textDecoration: 'underline', textUnderlineOffset: '3px' }}
            >clerk.com/legal/privacy</a>.
          </p>
        </div>
      </section>

      {/* Data storage */}
      <section style={{ borderBottom: '1px solid #444748', padding: 'clamp(48px, 7vw, 80px) 0' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 32px' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(20px, 2.5vw, 28px)',
            fontWeight: 700,
            color: '#e5e2e1',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            marginBottom: '20px',
          }}>
            Data storage
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '16px',
            color: '#c4c7c8',
            lineHeight: 1.75,
            maxWidth: '672px',
            marginBottom: '16px',
          }}>
            Financial data powering the Trikosh platform is stored in a PostgreSQL database hosted on Neon.tech. All connections to the database are encrypted using SSL/TLS. No sensitive personal or financial data belonging to users is stored in this database — it holds only publicly sourced market and financial data.
          </p>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '16px',
            color: '#c4c7c8',
            lineHeight: 1.75,
            maxWidth: '672px',
            margin: 0,
          }}>
            We do not store payment information of any kind. Trikosh is a free platform with no subscription or billing infrastructure.
          </p>
        </div>
      </section>

      {/* Cookies */}
      <section style={{ borderBottom: '1px solid #444748', padding: 'clamp(48px, 7vw, 80px) 0' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 32px' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(20px, 2.5vw, 28px)',
            fontWeight: 700,
            color: '#e5e2e1',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            marginBottom: '20px',
          }}>
            Cookies
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '16px',
            color: '#c4c7c8',
            lineHeight: 1.75,
            maxWidth: '672px',
            margin: 0,
          }}>
            We use only the cookies that Clerk requires to maintain your authenticated session. There are no analytics cookies, advertising cookies, or third-party tracking cookies. Blocking or deleting these session cookies will sign you out of the platform.
          </p>
        </div>
      </section>

      {/* Governing law & contact */}
      <section style={{ padding: 'clamp(48px, 7vw, 80px) 0' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 32px' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(20px, 2.5vw, 28px)',
            fontWeight: 700,
            color: '#e5e2e1',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            marginBottom: '20px',
          }}>
            Governing law & contact
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '16px',
            color: '#c4c7c8',
            lineHeight: 1.75,
            maxWidth: '672px',
            marginBottom: '16px',
          }}>
            This Privacy Policy is governed by and construed in accordance with the laws of India. Any disputes arising from this policy shall be subject to the exclusive jurisdiction of courts in India.
          </p>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '16px',
            color: '#c4c7c8',
            lineHeight: 1.75,
            maxWidth: '672px',
            margin: 0,
          }}>
            Questions about this policy? Email us at{' '}
            <a
              href="mailto:ashu10tripathi@gmail.com"
              style={{ color: '#e5e2e1', textDecoration: 'underline', textUnderlineOffset: '3px' }}
            >
              ashu10tripathi@gmail.com
            </a>.
          </p>
        </div>
      </section>
    </>
  )
}
