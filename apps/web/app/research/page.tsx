'use client'

import { useState } from 'react'

interface Step {
  number: string
  title: string
  duration: string
  tag: string
  tagColor: string
  body: string[]
  checklist: string[]
  warning?: string
}

const STEPS: Step[] = [
  {
    number: '01',
    title: 'Understand the Business Before You Touch a Single Number',
    duration: '2-4 hours',
    tag: 'Qualitative',
    tagColor: '#2563EB',
    body: [
      'Every analyst error I have witnessed in thirty years of teaching finance begins at the same place: the student opened Excel before they understood what the company actually does. This is the cardinal sin of equity research.',
      'Before you model a single line item, you must be able to explain the business to a twelve-year-old. Who are the customers? What problem does the company solve? Why would a customer choose this company over its competitor tomorrow morning? If you cannot answer these three questions without looking at your notes, you are not ready to model.',
      'Read the annual report - the entire thing, not just the financial statements. Pay particular attention to the letter to shareholders, the business description (Item 1 in a 10-K), and the risk factors. The risk factors are not boilerplate. Management is legally required to disclose what they genuinely believe could go wrong. That is some of the most valuable information in the document.',
    ],
    checklist: [
      'Read the full annual report (10-K / Annual Report)',
      'Identify the primary revenue stream - what does the company get paid for?',
      'Name the top 3 competitors and explain why this company wins or loses against each',
      'Identify the moat: network effects, switching costs, cost advantage, brand, or regulation',
      'Note the management team - how long has the CEO been in role? Do they own stock?',
      'Read the last 2 earnings call transcripts - what questions did analysts ask?',
    ],
  },
  {
    number: '02',
    title: 'Map the Industry and Establish the Competitive Context',
    duration: '2-3 hours',
    tag: 'Sector Analysis',
    tagColor: '#7C3AED',
    body: [
      'A company does not exist in isolation. A 20% net margin means nothing until you know whether the industry average is 8% or 35%. Context is everything in financial analysis, and context means peers.',
      'Use the Trikosh Peer Comparison tool to identify 4-6 companies in the same sector. These are your comparables - the benchmark against which every metric you compute will be judged. Choose peers carefully: a company that sells software to hospitals is not a peer of a company that manufactures medical devices, even if both sit in "Healthcare."',
      'Apply Porter\'s Five Forces as a structured thinking tool. Is the threat of new entrants high or low? Do suppliers have pricing power? What is the intensity of rivalry? Your answers will directly inform which financial metrics deserve the most scrutiny.',
    ],
    checklist: [
      'Identify 4-6 true peers using Trikosh - same sector, similar business model',
      'Apply Porter\'s Five Forces - write one sentence per force',
      'Determine the industry\'s primary value driver: revenue growth, margin expansion, or asset efficiency',
      'Note any structural tailwinds or headwinds (regulation, technology, demographics)',
      'Identify what the market is currently rewarding: high-growth names trading at premium multiples vs. mature names at value multiples',
    ],
    warning: 'Do not compare GAAP companies against IFRS companies without adjustment. Trikosh flags the accounting standard for each company - check it before building your comps table.',
  },
  {
    number: '03',
    title: 'Dissect the Three Financial Statements in Sequence',
    duration: '3-5 hours',
    tag: 'Quantitative Core',
    tagColor: '#059669',
    body: [
      'The three financial statements are not three separate documents. They are one integrated picture of a business taken from three different angles. The income statement shows what the company earned. The balance sheet shows what it owns and owes. The cash flow statement shows where cash actually moved. A sophisticated analyst reads all three simultaneously.',
      'Begin with the income statement, but resist the temptation to focus only on net income. Net income is the most manipulated line in the entire document. Instead, anchor your analysis on gross profit and operating income, because these are harder to obscure. Then use the cash flow statement to verify the income statement - if a company reports growing net income but declining operating cash flow, something is wrong.',
      'The balance sheet tells you about durability and financial resilience. A company with a fortress balance sheet - high cash, low debt, strong equity - can survive a recession and emerge stronger. A company with 6x leverage and tight covenants cannot afford a single bad quarter.',
    ],
    checklist: [
      'Income Statement: Extract 5 years of Revenue, Gross Profit, EBIT, EBITDA, Net Income',
      'Compute YoY growth rates for each line - is growth accelerating or decelerating?',
      'Check for one-time items: restructuring charges, asset write-downs, legal settlements',
      'Balance Sheet: Verify Assets = Liabilities + Equity for every year (use the template check row)',
      'Note the trend in cash, debt, and shareholders equity over 5 years',
      'Cash Flow: Confirm Operating CF is consistently positive - this is non-negotiable for quality',
      'Compute FCF = Operating CF minus CapEx for each year',
      'Flag any year where Net Income diverges significantly from Operating Cash Flow',
    ],
  },
  {
    number: '04',
    title: 'Compute and Interpret All 15 Standardised Ratios',
    duration: '1-2 hours',
    tag: 'Ratio Analysis',
    tagColor: '#D97706',
    body: [
      'Ratios are the language that allows you to compare a $2 billion company against a $200 billion company on equal terms. They strip away the absolute size and reveal the underlying economics. Trikosh pre-computes all 15 standardised ratios for every company in the database - your job is not to compute them, but to interpret them.',
      'Do not look at ratios in isolation. A current ratio of 1.2x is fine for a retailer with predictable daily cash inflows and terrible for a pharmaceutical company with lumpy revenue. Every ratio must be read in the context of the business model and benchmarked against peers from the same sector.',
      'Pay particular attention to trend, not just level. A gross margin that is declining from 65% to 55% over five years is a serious warning sign even if 55% is still good in absolute terms. Compression tells you something structural is changing - pricing power is eroding, input costs are rising, or competition is intensifying.',
    ],
    checklist: [
      'Profitability: Gross, Operating, Net, EBITDA Margins - note 5-year trend direction',
      'Returns: ROE, ROA, Asset Turnover - compare against sector benchmarks on the Sector Ratio Reference tab',
      'Liquidity: Current Ratio, Quick Ratio - is there sufficient buffer to cover short-term obligations?',
      'Leverage: Debt/Equity, Debt/EBITDA, Interest Coverage - what happens in a stress scenario?',
      'Cash Flow: FCF Margin, OCF Ratio, CapEx/Revenue - is earnings quality high?',
      'Flag any ratio that is an outlier vs. peers - investigate before concluding it is good or bad',
      'Compute 5-year averages for each margin to smooth out one-year anomalies',
    ],
  },
  {
    number: '05',
    title: 'Build the Peer Comparison Table',
    duration: '1-2 hours',
    tag: 'Relative Valuation',
    tagColor: '#DC2626',
    body: [
      'Relative valuation is the most widely used valuation methodology in practice, precisely because it is grounded in observable market prices rather than assumptions about the future. When a sector trades at 15x EBITDA on average and your subject company trades at 9x, the market is telling you something - your job is to understand whether it is telling you the stock is cheap or whether the discount is deserved.',
      'The three multiples you must compute are EV/Revenue, EV/EBITDA, and Price-to-Earnings. Use Enterprise Value based multiples (EV/Revenue and EV/EBITDA) to compare companies with different capital structures. P/E is useful for equity-to-equity comparisons but is distorted by leverage and one-time items.',
      'Anchor your analysis on the median, not the mean. One outlier company with an astronomical multiple will distort the mean; the median is robust. Use Trikosh\'s Comps tool - it highlights the winner and loser for each metric in green and red, so your eye immediately goes to where the spread is widest.',
    ],
    checklist: [
      'Select 4-5 peers using Trikosh - document why each is genuinely comparable',
      'Collect EV, Revenue, EBITDA, Net Income, and Shares Outstanding for each peer',
      'Compute EV/Revenue, EV/EBITDA, and P/E for each peer and your subject company',
      'Calculate the peer median for each multiple',
      'Apply the median multiple to your subject company\'s metrics to derive an implied valuation range',
      'Explain any discount or premium your company trades at relative to the peer median',
    ],
  },
  {
    number: '06',
    title: 'Build the DCF and Stress-Test Your Assumptions',
    duration: '3-4 hours',
    tag: 'Intrinsic Valuation',
    tagColor: '#0891B2',
    body: [
      'The Discounted Cash Flow model is the gold standard of intrinsic valuation. It asks a simple question: what is the present value of all the free cash flow this business will generate between now and forever? The mathematical answer to that question is what the business is worth, independent of what the market currently says.',
      'However, a DCF is only as good as its assumptions. The model has three primary inputs - projected free cash flow, the discount rate (WACC), and the terminal growth rate - and the output is exquisitely sensitive to small changes in each. A WACC of 9% vs. 11%, or a terminal growth rate of 2% vs. 3%, can change your implied share price by 30-50%. This is not a flaw in the model; it is a feature. It tells you exactly where to focus your research.',
      'The professional standard is not to produce one DCF output. It is to produce a sensitivity table: what is the implied share price at every combination of WACC and terminal growth rate across a reasonable range? If the stock is cheap across every scenario in that table, you have a high-conviction buy. If it is only cheap in your most optimistic scenario, you have a speculative bet.',
    ],
    checklist: [
      'Enter FY2024 actual revenue as your base in the template - never project from a projected base',
      'Justify your revenue growth assumptions - tie them to unit economics, not hope',
      'Use the company\'s own WACC if disclosed, or compute it (Risk-Free Rate + Beta x Equity Risk Premium + Debt component)',
      'Terminal growth rate should never exceed long-run GDP growth - 2.0-2.5% for mature companies',
      'Build a sensitivity table: WACC (plus or minus 1%) vs. Terminal Growth Rate (plus or minus 0.5%)',
      'Compare your DCF-implied price to the current market price - note the implied upside/downside',
      'State clearly which assumption is most critical to your thesis',
    ],
    warning: 'If your DCF only works with a terminal growth rate above 3.5% or a WACC below 7%, your growth assumptions are doing the heavy lifting. That is a red flag, not a buy signal.',
  },
  {
    number: '07',
    title: 'Write the Research Note',
    duration: '2-3 hours',
    tag: 'Communication',
    tagColor: '#4B5563',
    body: [
      'Analysis that cannot be communicated clearly has no value. The ability to distil a hundred hours of work into a crisp, well-argued research note is the skill that separates analysts who get promoted from analysts who stay at their desks. Writing forces precision of thought. If you cannot write a clear one-sentence thesis, you do not have one.',
      'A professional equity research note has a structure that has been refined over decades. It begins with the investment thesis - one sentence stating your recommendation and the primary reason. It then presents the bull case and the bear case with equal rigour. The analyst\'s job is not to be a cheerleader; it is to present the evidence and draw a reasoned conclusion.',
      'Your research note should end with a clear valuation conclusion: a price target derived from your DCF and comps analysis, a rating (Buy / Hold / Sell or equivalent), and the key catalyst that you expect to move the stock toward your target. Use the Research Notes tab in the template - it is structured to guide you through each section.',
    ],
    checklist: [
      'Write the one-sentence thesis first - everything else flows from it',
      'Present 3 bull case arguments with supporting data from your analysis',
      'Present 2 bear case risks - be honest; credibility requires acknowledging downside',
      'State your price target and the valuation methodology used to derive it',
      'Name one specific catalyst - earnings beat, product launch, regulatory approval - that could close the gap to your price target',
      'Cite all data sources: SEC filings, Trikosh database, company IR pages',
      'Have someone who does not know the company read your thesis statement - if they are confused, rewrite it',
    ],
  },
]

const SECTOR_RATIOS: Record<string, { primary: string[]; avoid: string[] }> = {
  'Financial Services': {
    primary: ['ROE', 'ROA', 'Net Interest Margin', 'Debt/Equity', 'Interest Coverage'],
    avoid: ['Current Ratio (use LCR instead)', 'Quick Ratio', 'Inventory-based metrics'],
  },
  'AI & Technology': {
    primary: ['FCF Margin', 'Revenue Growth YoY', 'Gross Margin', 'EV/Revenue', 'R&D as % Revenue'],
    avoid: ['Debt/EBITDA (often negative EBITDA in growth phase)', 'Asset Turnover (low for SaaS)'],
  },
  Healthcare: {
    primary: ['Gross Margin', 'R&D as % Revenue', 'Operating Margin', 'Interest Coverage', 'EV/EBITDA'],
    avoid: ['Asset Turnover (capital intensive)', 'Same-store metrics'],
  },
  'Consumer & Retail': {
    primary: ['Gross Margin', 'Asset Turnover', 'Current Ratio', 'CapEx to Revenue', 'EBITDA Margin'],
    avoid: ['ROA without adjusting for operating leases', 'EV/Revenue alone (low margins distort)'],
  },
  'Consumer Internet & Digital Platforms': {
    primary: ['Revenue Growth YoY', 'EBITDA Margin', 'FCF Margin', 'User Metrics', 'EV/Revenue'],
    avoid: ['P/E in early growth phase (often not profitable)', 'Traditional liquidity ratios'],
  },
}

export default function ResearchPage() {
  const [activeStep, setActiveStep] = useState(null as number | null)
  const [activeSector, setActiveSector] = useState(null as string | null)

  return (
    <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>

        <div style={{ marginBottom: '48px' }}>
          <div style={{
            display: 'inline-block',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.08em',
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}>
            Research Framework Ã‚Â· Trikosh Method
          </div>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '36px',
            fontWeight: 500,
            lineHeight: 1.15,
            color: 'var(--text-primary)',
            marginBottom: '16px',
          }}>
            How to Build an Equity Research Report From Scratch
          </h1>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '16px',
            lineHeight: 1.7,
            color: 'var(--text-secondary)',
            maxWidth: '700px',
            marginBottom: '24px',
          }}>
            A structured, seven-step methodology designed for students and early-stage analysts. Every step is grounded in institutional practice - the same process applied at investment banks and asset management firms. Follow it in sequence. Do not skip steps.
          </p>

          
            href="/Trikosh_Equity_Research_Template.xlsx"
            download
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: 'var(--accent-primary)',
              color: '#FFFFFF',
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: '8px',
              textDecoration: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download Research Template (.xlsx)
          </a>

          <div style={{ marginTop: '32px', borderBottom: 'var(--border-rest)', paddingBottom: '0' }} />
        </div>

        <div style={{ marginBottom: '48px' }}>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '20px',
            fontWeight: 500,
            color: 'var(--text-primary)',
            marginBottom: '8px',
          }}>
            Ratios by Sector - What to Prioritise
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '13px',
            color: 'var(--text-secondary)',
            marginBottom: '16px',
          }}>
            Not all 15 ratios carry equal weight in every sector. Select your sector below to see which metrics analysts prioritise and which to use with caution.
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {Object.keys(SECTOR_RATIOS).map(sector => (
              <button
                key={sector}
                onClick={() => setActiveSector(activeSector === sector ? null : sector)}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '12px',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: 'var(--border-rest)',
                  backgroundColor: activeSector === sector ? 'var(--accent-primary)' : 'var(--bg-surface-1)',
                  color: activeSector === sector ? '#FFFFFF' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {sector}
              </button>
            ))}
          </div>

          {activeSector && (
            <div style={{
              backgroundColor: 'var(--bg-surface-1)',
              border: 'var(--border-rest)',
              borderRadius: '10px',
              padding: '20px 24px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px',
            }}>
              <div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.08em',
                  color: '#059669',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}>
                  Prioritise These
                </div>
                {SECTOR_RATIOS[activeSector].primary.map(r => (
                  <div key={r} style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '13px',
                    color: 'var(--text-primary)',
                    padding: '4px 0',
                    borderBottom: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <span style={{ color: '#059669', fontWeight: 700 }}>+</span> {r}
                  </div>
                ))}
              </div>
              <div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.08em',
                  color: '#DC2626',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}>
                  Use With Caution
                </div>
                {SECTOR_RATIOS[activeSector].avoid.map(r => (
                  <div key={r} style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    padding: '4px 0',
                    borderBottom: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <span style={{ color: '#DC2626', fontWeight: 700 }}>!</span> {r}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '20px',
            fontWeight: 500,
            color: 'var(--text-primary)',
            marginBottom: '4px',
          }}>
            The Seven-Step Framework
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '13px',
            color: 'var(--text-tertiary)',
            marginBottom: '24px',
          }}>
            Click any step to expand the full guidance, checklist, and analyst notes.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {STEPS.map((step, idx) => {
            const isOpen = activeStep === idx
            return (
              <div
                key={step.number}
                style={{
                  backgroundColor: 'var(--bg-surface-1)',
                  border: isOpen ? `1px solid ${step.tagColor}40` : 'var(--border-rest)',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s',
                }}
              >
                <button
                  onClick={() => setActiveStep(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '18px 24px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '22px',
                    fontWeight: 700,
                    color: isOpen ? step.tagColor : 'var(--text-tertiary)',
                    minWidth: '40px',
                    transition: 'color 0.2s',
                  }}>
                    {step.number}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '15px',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      marginBottom: '4px',
                    }}>
                      {step.title}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        letterSpacing: '0.06em',
                        color: '#FFFFFF',
                        backgroundColor: step.tagColor,
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}>
                        {step.tag}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        color: 'var(--text-tertiary)',
                      }}>
                        {step.duration}
                      </span>
                    </div>
                  </div>
                  <div style={{
                    color: 'var(--text-tertiary)',
                    fontSize: '18px',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }}>
                    v
                  </div>
                </button>

                {isOpen && (
                  <div style={{ padding: '0 24px 24px 24px', borderTop: '1px solid var(--border-subtle)' }}>
                    {step.warning && (
                      <div style={{
                        margin: '16px 0',
                        padding: '12px 16px',
                        backgroundColor: '#FEF3C7',
                        borderLeft: '3px solid #D97706',
                        borderRadius: '0 6px 6px 0',
                      }}>
                        <span style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '13px',
                          color: '#92400E',
                          lineHeight: 1.6,
                        }}>
                          <strong>Note:</strong> {step.warning}
                        </span>
                      </div>
                    )}

                    {step.body.map((para, pi) => (
                      <p key={pi} style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '14px',
                        lineHeight: 1.75,
                        color: 'var(--text-secondary)',
                        margin: '16px 0',
                      }}>
                        {para}
                      </p>
                    ))}

                    <div style={{
                      marginTop: '20px',
                      backgroundColor: 'var(--bg-base)',
                      borderRadius: '8px',
                      padding: '16px 20px',
                      border: 'var(--border-rest)',
                    }}>
                      <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: step.tagColor,
                        marginBottom: '12px',
                        fontWeight: 700,
                      }}>
                        Analyst Checklist
                      </div>
                      {step.checklist.map((item, ci) => (
                        <div key={ci} style={{
                          display: 'flex',
                          gap: '10px',
                          alignItems: 'flex-start',
                          padding: '6px 0',
                          borderBottom: ci < step.checklist.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                        }}>
                          <div style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '3px',
                            border: `1.5px solid ${step.tagColor}`,
                            marginTop: '2px',
                            flexShrink: 0,
                          }} />
                          <span style={{
                            fontFamily: 'var(--font-sans)',
                            fontSize: '13px',
                            color: 'var(--text-primary)',
                            lineHeight: 1.5,
                          }}>
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div style={{
          marginTop: '48px',
          padding: '20px 24px',
          backgroundColor: 'var(--bg-surface-1)',
          border: 'var(--border-rest)',
          borderRadius: '10px',
        }}>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '12px',
            color: 'var(--text-tertiary)',
            lineHeight: 1.6,
            margin: 0,
          }}>
            <strong style={{ color: 'var(--text-secondary)' }}>Trikosh Research Framework</strong> - This methodology is derived from institutional equity research practice and is provided for educational purposes. All financial data on this platform is sourced from public filings via the Trikosh standardised pipeline. It does not constitute investment advice. Cite as: Trikosh Financial Research Infrastructure, trikosh.in, accessed [date].
          </p>
        </div>

      </div>
    </div>
  )
}