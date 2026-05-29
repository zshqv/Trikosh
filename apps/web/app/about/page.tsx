import Link from 'next/link'

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 24px 80px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '32px',
            fontWeight: 500,
            lineHeight: 1.2,
            color: 'var(--text-primary)',
            marginBottom: '36px',
          }}
        >
          About
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '48px' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
            Trikosh started as a personal frustration. In 2023, trying to research Sony for the first time â€” not to trade it, but to genuinely understand how it works as a business â€” I found no useful starting point. The data was fragmented, the frameworks were implicit, and everything assumed you already knew what you were looking for. I did not know what I was looking for. That is the point.
          </p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
            The financial infrastructure that professionals use every day â€” Bloomberg, FactSet, Capital IQ â€” costs thousands of dollars a month. Students and early-career analysts who are trying to learn do not have access to it. What they have is a search engine, a free tier of something, and a lot of fragmented PDFs. Trikosh is an attempt to build something that someone with a functional internet and a frontal lobe can use this, regardless of whether they have institutional access.
          </p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
            The platform is not trying to replace Bloomberg. It is trying to give finance students and CFA candidates the baseline they need to start doing real research â€” not scraping data from tables in PDFs, but actually asking analytical questions about businesses. The 100+ companies in the coverage universe were chosen for their analytical clarity, not their market cap. They are the companies that best illustrate how their sectors work.
          </p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
            Trikosh is open source and MIT licensed. The data comes from public filings â€” SEC EDGAR, annual reports, investor presentations. Everything is standardised on a consistent basis so you can compare companies without adjusting for different reporting formats. The source is always disclosed. The limitations are always noted. The platform does not have opinions about which companies to buy or sell. It has data, and it has frameworks for how to think about that data. What you do with it is your job.
          </p>
        </div>

        {/* Philosophy */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '20px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '16px' }}>
            Platform Philosophy
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              'Data without context is noise. Every number on this platform is paired with a framework for what it means.',
              'The goal is to make you a better analyst, not to make analysis easier. Trikosh does not tell you what to think.',
              'Financial research is a skill, not a product. This platform teaches the skill.',
              'Open source and free forever. MIT License. No paywalls. No signups required to read.',
            ].map((point, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--accent-primary)',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  0{i + 1}
                </span>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                  {point}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Open source */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '20px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '16px' }}>
            Open Source
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: '16px' }}>
            Trikosh is MIT licensed. The full codebase â€” Next.js frontend, FastAPI backend, Prisma schema, data pipeline â€” is available on GitHub. Contributions are welcome, particularly additions to the coverage universe, corrections to financial data, and improvements to the sector frameworks.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <a
              href="https://github.com/zshqv/Trikosh"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--accent-primary)',
                border: '1px solid var(--accent-primary)',
                borderRadius: '6px',
                padding: '8px 16px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(37,99,235,0.06)',
              }}
            >
              View on GitHub â†’
            </a>

            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: '#065F46',
                backgroundColor: '#D1FAE5',
                padding: '3px 8px',
                borderRadius: '4px',
              }}
            >
              MIT License
            </span>
          </div>
        </section>

        {/* Data sources */}
        <section id="data">
          <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '20px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '16px' }}>
            Data Sources
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              ['SEC EDGAR', 'Primary source for all US-listed companies. 10-K and 10-Q filings.'],
              ['Annual Reports', 'English-language annual reports for international companies.'],
              ['Investor Presentations', 'Management-prepared slides for supplemental segment data.'],
              ['Coverage Period', 'FY2019 â€“ FY2024 (5 fiscal years).'],
              ['Accounting Standard', 'GAAP for US companies, IFRS for international. Flagged per company.'],
              ['Currency', 'USD for all US companies. Originating currency for international companies, with USD conversion noted.'],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', gap: '16px', paddingBottom: '8px', borderBottom: 'var(--border-rest)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-tertiary)', minWidth: '160px', flexShrink: 0, paddingTop: '2px' }}>
                  {label}
                </span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}


