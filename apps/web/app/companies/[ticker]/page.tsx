'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { COMPANIES, MOCK_CARDS } from '@/lib/mockData'
import TickerBadge from '@/components/ui/TickerBadge'
import DeltaLabel from '@/components/ui/DeltaLabel'
import DataAssetCard from '@/components/ui/DataAssetCard'
import type { Sector } from '@/lib/types'
import { formatPercent, formatMultiple, formatCurrency } from '@/lib/utils'

type Tab = 'Financials' | 'Ratios' | 'Peers' | 'Overview'
type FinTab = 'Income Statement' | 'Balance Sheet' | 'Cash Flow'

const RATIOS_FULL = [
  { label: 'Gross Margin', value: 0.684, unit: 'PCT' as const, period: 'FY2024', peerContext: 'Above sector median' },
  { label: 'Operating Margin', value: 0.213, unit: 'PCT' as const, period: 'FY2024', peerContext: 'Above sector median' },
  { label: 'Net Margin', value: 0.178, unit: 'PCT' as const, period: 'FY2024', peerContext: 'Above sector median' },
  { label: 'ROE', value: 0.252, unit: 'PCT' as const, period: 'FY2024', peerContext: 'Above sector median' },
  { label: 'ROIC', value: 0.188, unit: 'PCT' as const, period: 'FY2024', peerContext: 'Above sector median' },
  { label: 'FCF Margin', value: 0.221, unit: 'PCT' as const, period: 'FY2024', peerContext: 'Above sector median' },
  { label: 'Current Ratio', value: 1.3, unit: 'RATIO' as const, period: 'FY2024', peerContext: 'Below sector median' },
  { label: 'Debt/Equity', value: 0.48, unit: 'RATIO' as const, period: 'FY2024', peerContext: 'Below sector median' },
  { label: 'P/E', value: 14.8, unit: 'MULTIPLE' as const, period: 'FY2024', peerContext: 'Below sector median' },
  { label: 'EV/EBITDA', value: 13.2, unit: 'MULTIPLE' as const, period: 'FY2024', peerContext: 'Below sector median' },
  { label: 'Revenue CAGR', value: 0.048, unit: 'PCT' as const, period: 'FY2019–FY2024', peerContext: 'Below sector median' },
  { label: 'R&D Intensity', value: 0.154, unit: 'PCT' as const, period: 'FY2024', peerContext: 'Above sector median' },
]

const INCOME_STATEMENT = [
  { metric: 'Revenue', fy2020: 82.6e9, fy2021: 93.8e9, fy2022: 94.9e9, fy2023: 85.2e9, fy2024: 88.8e9 },
  { metric: 'Gross Profit', fy2020: 54.4e9, fy2021: 62.0e9, fy2022: 63.0e9, fy2023: 57.0e9, fy2024: 60.7e9 },
  { metric: 'Operating Income', fy2020: 18.0e9, fy2021: 22.3e9, fy2022: 21.8e9, fy2023: 17.4e9, fy2024: 18.9e9 },
  { metric: 'Net Income', fy2020: 14.7e9, fy2021: 20.9e9, fy2022: 17.9e9, fy2023: 13.8e9, fy2024: 15.8e9 },
  { metric: 'EPS (diluted)', fy2020: 5.51, fy2021: 7.81, fy2022: 6.73, fy2023: 5.30, fy2024: 6.02 },
]

function formatTableValue(label: string, value: number): string {
  if (label === 'EPS (diluted)') return `$${value.toFixed(2)}`
  return formatCurrency(value)
}

function yoyDelta(current: number, prev: number): number {
  return (current - prev) / Math.abs(prev)
}

export default function CompanyDetailPage() {
  const { ticker } = useParams<{ ticker: string }>()
  const [activeTab, setActiveTab] = useState<Tab>('Financials')
  const [finTab, setFinTab] = useState<FinTab>('Income Statement')

  const company = COMPANIES.find(c => c.ticker === ticker)
  const card = MOCK_CARDS.find(c => c.company.ticker === ticker)
  const peers = MOCK_CARDS.filter(c => c.company.sector === company?.sector && c.company.ticker !== ticker).slice(0, 4)

  if (!company) {
    return (
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-tertiary)' }}>
          Company not found: {ticker}
        </p>
        <Link href="/companies" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontSize: '14px' }}>
          ← Back to Companies
        </Link>
      </div>
    )
  }

  const TABS: Tab[] = ['Financials', 'Ratios', 'Peers', 'Overview']

  const RESEARCH_QUESTIONS: Record<Sector, string[]> = {
    'Financial Services': [
      'How does this company\'s net interest margin compare across different interest rate cycles, and what is its sensitivity to a 100bps rate move?',
      'What proportion of revenues comes from fee-based versus spread-based income, and how does that mix affect earnings stability?',
      'How does the CET1 ratio compare to the regulatory minimum, and what does the excess capital suggest about future capital return capacity?',
    ],
    'AI & Technology': [
      'What percentage of revenue is recurring, and how has net revenue retention trended over the past three years?',
      'How does the R&D intensity compare to peers, and is there evidence that R&D investment is translating into accelerating revenue growth?',
      'How does FCF margin trajectory compare to operating margin — and does the gap tell you something about working capital or capex intensity?',
    ],
    'Healthcare': [
      'What is the revenue concentration in the top three products, and what is the patent expiry timeline for the highest-revenue drug?',
      'How does the gross margin compare to pure-play peers in the same sub-sector, and what explains any gap?',
      'What clinical stage is the pipeline in, and what is the historical approval rate for drugs that reach Phase III from this company\'s pipeline?',
    ],
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Breadcrumb */}
        <div style={{ marginBottom: '20px' }}>
          <Link
            href="/companies"
            style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}
          >
            ← Companies
          </Link>
        </div>

        {/* Header */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface-1)',
            border: 'var(--border-rest)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ marginBottom: '10px' }}>
                <TickerBadge ticker={company.ticker} exchange={company.exchange} />
              </div>
              <h1
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '32px',
                  fontWeight: 500,
                  lineHeight: 1.2,
                  color: 'var(--text-primary)',
                  marginBottom: '8px',
                }}
              >
                {company.name}
              </h1>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-tertiary)', marginBottom: '6px' }}>
                {company.sector} · {company.industry}
              </p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', fontStyle: 'italic', maxWidth: '560px', lineHeight: 1.5 }}>
                {company.analyticalLens}
              </p>
            </div>
            <button
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                color: 'var(--accent-primary)',
                border: 'var(--border-hover)',
                borderRadius: '6px',
                padding: '8px 16px',
                backgroundColor: 'rgba(37,99,235,0.06)',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              Export for Analysis
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div
          style={{
            display: 'flex',
            gap: '0',
            borderBottom: 'var(--border-rest)',
            marginBottom: '24px',
          }}
        >
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '14px',
                fontWeight: activeTab === tab ? 500 : 400,
                color: activeTab === tab ? 'var(--accent-primary)' : 'var(--text-secondary)',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid var(--accent-primary)' : '2px solid transparent',
                padding: '10px 20px',
                cursor: 'pointer',
                transition: 'color 150ms ease',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Financials tab */}
        {activeTab === 'Financials' && (
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {(['Income Statement', 'Balance Sheet', 'Cash Flow'] as FinTab[]).map(ft => (
                <button
                  key={ft}
                  onClick={() => setFinTab(ft)}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '12px',
                    padding: '5px 12px',
                    borderRadius: '5px',
                    border: 'var(--border-rest)',
                    backgroundColor: finTab === ft ? 'var(--bg-muted)' : 'var(--bg-surface-1)',
                    color: finTab === ft ? 'var(--text-primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  {ft}
                </button>
              ))}
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'var(--bg-surface-1)', borderRadius: '8px', overflow: 'hidden', border: 'var(--border-rest)' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-surface-2)' }}>
                    <th style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', padding: '10px 16px', textAlign: 'left', border: 'var(--border-rest)' }}>Metric</th>
                    {['FY2020', 'FY2021', 'FY2022', 'FY2023', 'FY2024'].map(yr => (
                      <th key={yr} style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', padding: '10px 16px', textAlign: 'right', border: 'var(--border-rest)' }}>{yr}</th>
                    ))}
                    <th style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', padding: '10px 16px', textAlign: 'right', border: 'var(--border-rest)' }}>YoY</th>
                  </tr>
                </thead>
                <tbody>
                  {INCOME_STATEMENT.map((row, i) => {
                    const delta = yoyDelta(row.fy2024, row.fy2023)
                    return (
                      <tr key={row.metric} style={{ backgroundColor: i % 2 === 0 ? 'var(--bg-surface-1)' : 'var(--bg-base)' }}>
                        <td style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-primary)', padding: '10px 16px', border: 'var(--border-rest)' }}>{row.metric}</td>
                        {[row.fy2020, row.fy2021, row.fy2022, row.fy2023, row.fy2024].map((v, j) => (
                          <td key={j} style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums', padding: '10px 16px', textAlign: 'right', border: 'var(--border-rest)' }}>
                            {formatTableValue(row.metric, v)}
                          </td>
                        ))}
                        <td style={{ padding: '10px 16px', textAlign: 'right', border: 'var(--border-rest)' }}>
                          <DeltaLabel value={delta} size="sm" />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '12px' }}>
              Source: SEC 10-K · FY2024 · GAAP · USD · Last updated: 2025-01-22 · Known limitations: Figures based on public filings; segment reclassifications may affect historical comparability.
            </p>
          </div>
        )}

        {/* Ratios tab */}
        {activeTab === 'Ratios' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
              {RATIOS_FULL.map(ratio => {
                const above = ratio.peerContext === 'Above sector median'
                const fmtValue = ratio.unit === 'PCT' ? formatPercent(ratio.value) : ratio.unit === 'MULTIPLE' ? formatMultiple(ratio.value) : ratio.value.toFixed(2)
                return (
                  <div
                    key={ratio.label}
                    style={{
                      backgroundColor: 'var(--bg-surface-1)',
                      border: 'var(--border-rest)',
                      borderRadius: '8px',
                      padding: '16px',
                    }}
                  >
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', marginBottom: '6px' }}>
                      {ratio.label}
                    </p>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '22px', fontWeight: 500, fontVariantNumeric: 'tabular-nums', color: 'var(--text-primary)', marginBottom: '6px' }}>
                      {fmtValue}
                    </p>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: above ? 'var(--delta-pos)' : 'var(--delta-neg)', fontWeight: 500 }}>
                      {above ? '▲' : '▼'} {ratio.peerContext}
                    </p>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '4px' }}>{ratio.period}</p>
                  </div>
                )
              })}
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '12px' }}>
              Source: SEC 10-K · FY2024 · GAAP · USD · Last updated: 2025-01-22 · Known limitations: Peer median calculated from Trikosh coverage universe only.
            </p>
          </div>
        )}

        {/* Peers tab */}
        {activeTab === 'Peers' && (
          <div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Peer companies in {company.sector}.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {peers.map(peer => (
                <DataAssetCard key={peer.company.ticker} data={peer} />
              ))}
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '12px' }}>
              Source: SEC 10-K · FY2024 · GAAP · USD · Last updated: 2025-01-22 · Known limitations: Peer selection limited to Trikosh coverage universe.
            </p>
          </div>
        )}

        {/* Overview tab */}
        {activeTab === 'Overview' && (
          <div style={{ maxWidth: '640px' }}>
            <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '20px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '16px' }}>
              Key Research Questions
            </h2>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
              These questions do not have answers here. Your job is to find them — in the 10-K, the earnings calls, and the financial statements.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {RESEARCH_QUESTIONS[company.sector].map((q, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: 'var(--bg-surface-1)',
                    border: 'var(--border-rest)',
                    borderRadius: '8px',
                    padding: '20px',
                    borderLeft: '3px solid var(--accent-primary)',
                  }}
                >
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent-primary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Question {i + 1}
                  </p>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                    {q}
                  </p>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '24px' }}>
              Source: SEC 10-K · FY2024 · GAAP · USD · Last updated: 2025-01-22 · Known limitations: Research questions are sector-generic; company-specific nuances should be identified from filings.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
