'use client'

const AUDIT_SECTIONS = [
  {
    number: '01',
    title: 'Scope of Testing',
    items: [
      'Authentication flow (Clerk integration)',
      'API route protection and unauthorized access attempts',
      'Database connection security (SSL-enforced Neon.tech PostgreSQL)',
      'Environment variable exposure checks',
      'Dependency vulnerability scan',
    ],
  },
  {
    number: '02',
    title: 'Findings & Resolutions',
    items: [
      'All API routes returning financial data are protected and return 401 for unauthenticated requests where applicable',
      'Database credentials are stored exclusively as environment variables and are never exposed in client-side code',
      'SSL is enforced on all database connections (sslmode=require)',
      'No critical or high-severity vulnerabilities found in production dependencies at time of audit',
    ],
  },
  {
    number: '03',
    title: 'Ongoing Practices',
    items: [
      'Dependencies reviewed on each pipeline update',
      'No user financial data is stored — the platform only serves pre-computed public market data',
      'Responsible disclosure: security issues can be reported via GitHub Issues marked [SECURITY]',
    ],
  },
]

const PILLARS = [
  {
    label: '01',
    title: 'Authentication',
    body: 'All authentication is handled by Clerk, which is SOC 2 Type II certified. Clerk manages credential storage, session tokens, and multi-factor authentication. Trikosh servers never see or store your password.',
  },
  {
    label: '02',
    title: 'Database encryption',
    body: 'Financial data is stored in a PostgreSQL database on Neon.tech. All client–server connections are encrypted with SSL/TLS. Neon encrypts data at rest and operates within secure, isolated compute environments.',
  },
  {
    label: '03',
    title: 'No sensitive data',
    body: 'Trikosh stores no payment data, no government IDs, and no sensitive personal information. The only user data we hold is what Clerk provides for account management: email address and basic profile.',
  },
  {
    label: '04',
    title: 'Open-source codebase',
    body: 'The entire Trikosh codebase is public under MIT License. Security through obscurity is not a defence. You can read every line, audit every dependency, and raise issues or PRs directly on GitHub.',
  },
]

export default function SecurityPage() {
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
            Security
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
            How we protect your data
          </h1>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '16px',
            color: '#c4c7c8',
            lineHeight: 1.75,
            maxWidth: '672px',
            margin: 0,
          }}>
            We take a minimal-footprint approach to security: collect less, store less, expose less. Here is exactly what we do and who we rely on.
          </p>
        </div>
      </section>

      {/* Four pillars */}
      <section style={{ borderBottom: '1px solid #444748', padding: 'clamp(48px, 7vw, 80px) 0' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {PILLARS.map((pillar, i) => (
              <div
                key={pillar.label}
                style={{
                  display: 'flex',
                  gap: '32px',
                  alignItems: 'flex-start',
                  padding: '32px 0',
                  borderBottom: i < PILLARS.length - 1 ? '1px solid rgba(68,71,72,0.4)' : 'none',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: '#8e9192',
                  paddingTop: '4px',
                  flexShrink: 0,
                  width: '24px',
                  letterSpacing: '0.08em',
                }}>
                  {pillar.label}
                </span>
                <div>
                  <p style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '17px',
                    fontWeight: 700,
                    color: '#e5e2e1',
                    lineHeight: 1.25,
                    marginBottom: '10px',
                  }}>
                    {pillar.title}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '15px',
                    color: '#c4c7c8',
                    lineHeight: 1.7,
                    maxWidth: '560px',
                    margin: 0,
                  }}>
                    {pillar.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Data Integrity audit summary */}
      <section style={{ borderBottom: '1px solid #444748', padding: 'clamp(48px, 7vw, 80px) 0' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 32px' }}>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase',
            letterSpacing: '0.14em', color: '#8e9192', marginBottom: '16px',
          }}>
            Security Audit
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 2.5vw, 28px)',
            fontWeight: 700, color: '#e5e2e1', letterSpacing: '-0.02em',
            lineHeight: 1.15, marginBottom: '10px',
          }}>
            Security &amp; Data Integrity
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: '15px', color: '#8e9192',
            lineHeight: 1.7, maxWidth: '600px', marginBottom: '36px',
          }}>
            A summary of the security review conducted on the Trikosh platform, covering authentication, database access, API protection, and dependency hygiene.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {AUDIT_SECTIONS.map((section, i) => (
              <div
                key={section.number}
                style={{
                  display: 'flex', gap: '32px', alignItems: 'flex-start',
                  padding: '28px 0',
                  borderBottom: i < AUDIT_SECTIONS.length - 1 ? '1px solid rgba(68,71,72,0.4)' : 'none',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#8e9192',
                  paddingTop: '3px', flexShrink: 0, width: '24px', letterSpacing: '0.08em',
                }}>
                  {section.number}
                </span>
                <div>
                  <p style={{
                    fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700,
                    color: '#e5e2e1', lineHeight: 1.25, marginBottom: '14px',
                  }}>
                    {section.title}
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {section.items.map((item, j) => (
                      <li key={j} style={{
                        fontFamily: 'var(--font-sans)', fontSize: '14px', color: '#c4c7c8',
                        lineHeight: 1.65, paddingLeft: '16px', position: 'relative',
                        maxWidth: '560px',
                      }}>
                        <span style={{
                          position: 'absolute', left: 0, color: '#8e9192',
                          fontSize: '10px', top: '5px',
                        }}>
                          ·
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
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
            View the source
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '16px',
            color: '#c4c7c8',
            lineHeight: 1.75,
            maxWidth: '672px',
            marginBottom: '28px',
          }}>
            Trikosh is fully open source under the MIT License. The code that handles your requests, reads from the database, and renders the UI is publicly auditable. If you spot a dependency with a known vulnerability or a configuration that concerns you, open an issue.
          </p>
          <a
            href="https://github.com/zshqv/Trikosh"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#131313',
              backgroundColor: '#ffffff',
              padding: '12px 32px',
              borderRadius: '6px',
              textDecoration: 'none',
              transition: 'opacity 150ms ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.88' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
          >
            github.com/zshqv/Trikosh ↗
          </a>
        </div>
      </section>

      {/* Responsible disclosure */}
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
            Responsible disclosure
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '16px',
            color: '#c4c7c8',
            lineHeight: 1.75,
            maxWidth: '672px',
            marginBottom: '16px',
          }}>
            We follow responsible disclosure practices. If you discover a security vulnerability in Trikosh, please report it privately before publishing details publicly. We will acknowledge your report within 72 hours and work to resolve confirmed issues promptly.
          </p>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '16px',
            color: '#c4c7c8',
            lineHeight: 1.75,
            maxWidth: '672px',
            margin: 0,
          }}>
            To report a vulnerability, email{' '}
            <a
              href="mailto:ashu10tripathi@gmail.com"
              style={{ color: '#e5e2e1', textDecoration: 'underline', textUnderlineOffset: '3px' }}
            >
              ashu10tripathi@gmail.com
            </a>. Please include a description of the issue, steps to reproduce, and the potential impact.
          </p>
        </div>
      </section>
    </>
  )
}
