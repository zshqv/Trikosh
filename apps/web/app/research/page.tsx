import Link from 'next/link'

const FINANCIAL_SECTOR_CHECKLIST = [
  'What is the current NIM and how has it trended over the last four quarters?',
  'What is the CET1 ratio relative to the regulatory minimum and internal target?',
  'What is the efficiency ratio, and is it improving year-over-year?',
  'What percentage of revenue is fee-based versus net interest income?',
  'What is the net charge-off rate and how does it compare to the prior cycle?',
  'What are the provision levels relative to non-performing loans?',
  'Has management issued forward guidance on NIM in the current rate environment?',
  'What is the loan growth rate and where is it concentrated?',
  'Is there capital constraint on buybacks or dividends from a regulatory capital buffer perspective?',
  'What is the return on tangible common equity versus peers?',
]

const HEALTHCARE_CHECKLIST = [
  'What is the revenue concentration in the top three products?',
  'When do the key patents for the largest drug expire, and what is the biosimilar landscape?',
  'What is the R&D intensity as a percentage of revenue versus pharma peers?',
  'How many drugs are in Phase III trials and what is the expected approval timeline?',
  'What is the gross margin trend, and is there evidence of pricing pressure?',
  'What is the MLR trend for managed care companies and how does it compare to guidance?',
  'Has the company completed any M&A to address pipeline gaps, and at what price?',
  'What percentage of revenue comes from US versus international markets?',
  'What is the free cash flow conversion rate from net income?',
  'Has management issued guidance on the revenue impact of the Inflation Reduction Act?',
]

const TECH_CHECKLIST = [
  'What percentage of revenue is recurring (subscriptions, multi-year contracts)?',
  'What is the net revenue retention rate, and has it been above or below 110% over the past year?',
  'What is the rule-of-40 score (revenue growth + FCF margin)?',
  'How does the R&D intensity compare to peers, and is it correlated with revenue growth acceleration?',
  'What is the revenue CAGR over five years, and what portion is organic versus acquired?',
  'What are the gross margin trends, and is there evidence of AI-related cost pressure?',
  'What is the remaining performance obligation (RPO) growth rate — the best leading indicator of future revenue?',
  'How is capex trending as a percentage of revenue, and what is driving investment?',
  'What percentage of revenue comes from the top five customers?',
  'Has operating leverage materialised — is operating margin expanding as revenue grows?',
]

export default function ResearchPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px 80px' }}>
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
          Research Guide
        </h1>

        {/* Sony founding story */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '20px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '16px' }}>
            Why Trikosh Exists
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              In 2023, trying to research Sony for the first time, I hit a wall immediately. The company has six distinct business segments — games, music, pictures, electronics, financial services, imaging sensors — and the data for each of them lived in completely different places. Some was in English annual reports on the Sony investor relations page. Some was buried in Japanese earnings supplements. The segment accounting changed between years. There was no baseline to start from.
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              I spent more time finding data than analysing it. And I was looking at one company. The problem wasn&apos;t intelligence. It was friction. No standardised starting point. No sector context. No explanation of what the numbers mean in the context of that particular industry.
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              Trikosh is what I wished had existed then. Standardised financial data for companies that define their sectors. Ratio analysis already computed. Sector frameworks that explain what to look for before you open the filing. A glossary written for people who are learning, not for people who already know. The purpose is not to do the analysis for you — it is to give you a place to start, so you can do the thinking yourself.
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              The coverage is 50 companies. They were chosen not because they are the biggest, but because they are the clearest examples of what their sectors do. JPMorgan is in the database not because it is the largest US bank, but because it is the one that best illustrates how commercial banking works. NVIDIA is in the database because it is the infrastructure layer of the AI cycle — understanding NVIDIA means understanding AI capital expenditure economics. Each company earns its place by being analytically useful.
            </p>
          </div>
        </section>

        {/* Where to begin */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '20px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '16px' }}>
            Where to Begin
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              The first thing you read when researching a company should not be the 10-K. Read the investor presentation and the latest earnings call transcript first. The investor presentation gives you the story management wants to tell. The earnings call gives you the questions analysts actually care about. Together they tell you what the consensus debate is before you form your own view.
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              Then read the annual report. Start with the MD&amp;A — Management Discussion and Analysis. It is where management explains the numbers in plain language. After that, read the notes to the financial statements. Most of the important accounting choices are buried there, not in the headline figures.
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              In an annual report: read the business overview first, then risk factors (the honest ones), then MD&amp;A, then the actual financial statements, then the notes. Do not start with the financials — without context, the numbers tell you nothing.
            </p>
          </div>
        </section>

        {/* Income Statement */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '20px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '16px' }}>
            The Income Statement
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              Start with revenue. Is it growing? What is driving the growth — price, volume, or mix? Is growth accelerating or decelerating? Are there one-time items inflating the number? Is revenue recurring or transactional?
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              Then move to gross margin. Gross margin tells you the fundamental economics of the product or service. A declining gross margin is a red flag — it means either pricing power is eroding, input costs are rising faster than selling prices, or the revenue mix is shifting toward lower-value products. Always compare gross margin to peers, not to a fixed target.
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              Red flags on the income statement: revenue growing faster than accounts receivable (or the reverse), gross margin declining while revenue grows, large restructuring charges recurring every year, aggressive revenue recognition in the notes, non-GAAP adjustments that exclude real economic costs.
            </p>
          </div>
        </section>

        {/* Balance Sheet */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '20px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '16px' }}>
            The Balance Sheet
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              The balance sheet tells you what the company owns and what it owes. The most important question is whether the asset base can support the liability structure across different economic scenarios. Net debt is a starting point — but it is only meaningful in the context of the earnings capacity to service it.
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              Leverage signals to watch: is net debt rising faster than EBITDA? Is the debt maturity profile concentrated in the near term? Does goodwill represent a large proportion of total assets (and if so, what acquisitions created it)? Is inventory building unexpectedly? Are days sales outstanding extending?
            </p>
          </div>
        </section>

        {/* Cash Flow Statement */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '20px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '16px' }}>
            The Cash Flow Statement
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              Free cash flow diverges from net income for two main reasons: working capital movements and non-cash charges (primarily depreciation and amortisation). A company that earns strong net income but generates weak FCF is usually consuming working capital — either receivables are rising or payables are falling — which can signal underlying operational stress.
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              In the investing activities section, look at capex relative to depreciation. If capex is persistently above depreciation, the company is investing in growth. If capex equals depreciation, it is in maintenance mode. In the financing activities section, rising debt alongside falling cash is a warning sign. Buybacks funded by debt deserve scrutiny.
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              FCF conversion (FCF divided by net income) above 90% over multiple years suggests high-quality earnings. Below 70% consistently is a flag worth investigating.
            </p>
          </div>
        </section>

        {/* Sector Checklists */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '20px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '24px' }}>
            Sector Checklists
          </h2>

          {[
            { sector: 'Financial Services', items: FINANCIAL_SECTOR_CHECKLIST },
            { sector: 'Healthcare', items: HEALTHCARE_CHECKLIST },
            { sector: 'AI & Technology', items: TECH_CHECKLIST },
          ].map(({ sector, items }) => (
            <div key={sector} style={{ marginBottom: '32px' }}>
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '14px' }}>
                {sector}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {items.map((item, i) => (
                  <label
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '14px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.55,
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      style={{
                        marginTop: '3px',
                        accentColor: 'var(--accent-primary)',
                        flexShrink: 0,
                      }}
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Download template */}
        <section>
          <div
            style={{
              backgroundColor: 'var(--bg-surface-1)',
              border: 'var(--border-rest)',
              borderRadius: '12px',
              padding: '28px',
            }}
          >
            <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '18px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '10px' }}>
              Download Template
            </h2>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '20px', maxWidth: '520px' }}>
              The equity research template contains a structured income statement model (FY2019–FY2024), a ratio calculator with all 12 Trikosh ratios pre-built, a peer comparison grid, and a two-page analyst write-up template. Use it as a starting point for your own analysis.
            </p>
            <Link
              href="/api/template"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '14px',
                fontWeight: 500,
                color: '#FFFFFF',
                backgroundColor: 'var(--accent-primary)',
                padding: '10px 20px',
                borderRadius: '6px',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Download Equity Research Template
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
