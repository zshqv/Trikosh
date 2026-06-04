'use client'

export default function TermsPage() {
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
            Terms of Service
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
            Terms of Service
          </h1>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '16px',
            color: '#c4c7c8',
            lineHeight: 1.75,
            maxWidth: '672px',
            margin: 0,
          }}>
            By using Trikosh you agree to these terms. Please read them carefully — they are written to be clear, not to bury obligations in legalese.
          </p>
        </div>
      </section>

      {/* What Trikosh is */}
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
            What Trikosh is
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '16px',
            color: '#c4c7c8',
            lineHeight: 1.75,
            maxWidth: '672px',
            marginBottom: '16px',
          }}>
            Trikosh is a free, open-source financial research platform. The codebase is published under the MIT License at{' '}
            <a
              href="https://github.com/zshqv/Trikosh"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#e5e2e1', textDecoration: 'underline', textUnderlineOffset: '3px' }}
            >
              github.com/zshqv/Trikosh
            </a>. There is no charge to use the platform and there will never be a paywall in front of the core data.
          </p>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '16px',
            color: '#c4c7c8',
            lineHeight: 1.75,
            maxWidth: '672px',
            margin: 0,
          }}>
            All financial data on Trikosh is sourced from public markets via yFinance and the Financial Modeling Prep API. It is provided for educational and research purposes only.
          </p>
        </div>
      </section>

      {/* Not financial advice */}
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
            Not financial advice
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '16px',
            color: '#c4c7c8',
            lineHeight: 1.75,
            maxWidth: '672px',
            marginBottom: '16px',
          }}>
            Nothing on this platform constitutes financial advice, investment recommendation, or a solicitation to buy or sell any security. Trikosh is a research tool — it gives you data and a framework for analysis. What you do with that analysis is entirely your own decision.
          </p>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '16px',
            color: '#c4c7c8',
            lineHeight: 1.75,
            maxWidth: '672px',
            margin: 0,
          }}>
            Financial data displayed may be delayed, contain errors, or become outdated. Always verify critical figures through official filings (annual reports, exchange disclosures) before making any financial decisions.
          </p>
        </div>
      </section>

      {/* Eligibility */}
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
            Eligibility
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '16px',
            color: '#c4c7c8',
            lineHeight: 1.75,
            maxWidth: '672px',
            margin: 0,
          }}>
            You must be at least 18 years of age to create a Trikosh account. If you are under 18, you may use the platform only with the explicit consent and supervision of a parent or legal guardian who agrees to these terms on your behalf.
          </p>
        </div>
      </section>

      {/* Acceptable use */}
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
            Acceptable use
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '16px',
            color: '#c4c7c8',
            lineHeight: 1.75,
            maxWidth: '672px',
            marginBottom: '20px',
          }}>
            Trikosh is built for individual research and learning. The following are not permitted:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '672px' }}>
            {[
              'Automated scraping, bulk downloading, or systematic extraction of data from the platform for commercial redistribution',
              'Reselling, sublicensing, or commercially redistributing the financial data served by this platform',
              'Attempting to circumvent authentication, access controls, or rate limits',
              'Using the platform in any way that violates applicable law',
            ].map((rule, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: '#8e9192',
                  paddingTop: '4px',
                  flexShrink: 0,
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '15px',
                  color: '#c4c7c8',
                  lineHeight: 1.65,
                  margin: 0,
                }}>
                  {rule}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open source */}
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
            Open-source license
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '16px',
            color: '#c4c7c8',
            lineHeight: 1.75,
            maxWidth: '672px',
            margin: 0,
          }}>
            The Trikosh codebase is licensed under the MIT License. You are free to fork, modify, and redistribute the code in accordance with the terms of that license. The MIT License applies to the source code only — it does not grant a licence to the financial data served by this platform.
          </p>
        </div>
      </section>

      {/* Account suspension & governing law */}
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
            Account suspension & governing law
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '16px',
            color: '#c4c7c8',
            lineHeight: 1.75,
            maxWidth: '672px',
            marginBottom: '16px',
          }}>
            Trikosh reserves the right to suspend or terminate accounts that violate these terms, engage in abuse of the platform, or act in a manner that harms other users or the integrity of the data.
          </p>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '16px',
            color: '#c4c7c8',
            lineHeight: 1.75,
            maxWidth: '672px',
            margin: 0,
          }}>
            These Terms of Service are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in India.
          </p>
        </div>
      </section>
    </>
  )
}
