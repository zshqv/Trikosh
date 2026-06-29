import type { FinancialMetric } from '@/lib/types'
import { formatPercent, formatMultiple } from '@/lib/utils'
import { tokens } from '@/lib/tokens'

interface RatioRailProps {
  ratios: FinancialMetric[]
}

const RATIO_DESCRIPTIONS: Record<string, string> = {
  'Gross Margin':      'Revenue minus COGS as a % of revenue. Reflects pricing power and input cost efficiency.',
  'Operating Margin':  'EBIT as a % of revenue. Captures operating leverage after all recurring costs.',
  'Net Margin':        'Bottom-line profit as a % of revenue after all costs, interest, and tax.',
  'ROE':               'Net income ÷ shareholders equity. Measures efficiency of equity capital deployment.',
  'Return on Equity':  'Net income ÷ shareholders equity. Measures efficiency of equity capital deployment.',
  'ROA':               'Net income ÷ total assets. Shows how well earnings are generated from the asset base.',
  'P/E':               'Price ÷ earnings per share. Contextualise against sector peers and earnings growth.',
  'P/E Ratio':         'Price ÷ earnings per share. Contextualise against sector peers and earnings growth.',
  'EV/EBITDA':         'Enterprise value ÷ EBITDA. Capital-structure neutral, useful for cross-border comparisons.',
  'Debt/Equity':       'Total debt ÷ equity. Indicates reliance on debt vs. equity financing.',
  'FCF Yield':         'Free cash flow as a % of market cap. Higher = more cash per dollar of market value.',
  'Current Ratio':     'Current assets ÷ current liabilities. Below 1× may signal near-term liquidity pressure.',
  'NIM':               'Net interest margin. The spread earned by banks between lending rates and funding costs.',
  'CET1':              'Common Equity Tier 1 ratio. Core regulatory capital as a % of risk-weighted assets.',
  'Rev Growth':        'Year-over-year revenue growth rate.',
}

function formatRatioValue(metric: FinancialMetric): string {
  if (metric.unit === 'PCT') return formatPercent(metric.value)
  if (metric.unit === 'MULTIPLE') return formatMultiple(metric.value)
  return metric.value.toFixed(2)
}

export default function RatioRail({ ratios }: RatioRailProps) {
  const displayed = ratios.slice(0, 4)
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '0', flexWrap: 'nowrap', overflowX: 'auto' }}>
      {displayed.map((ratio, i) => (
        <div
          key={ratio.label}
          title={RATIO_DESCRIPTIONS[ratio.label]}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            minWidth: 'max-content',
            paddingRight: i < displayed.length - 1 ? '12px' : 0,
            marginRight: i < displayed.length - 1 ? '12px' : 0,
            borderRight: i < displayed.length - 1 ? '1px solid var(--outline-variant)' : 'none',
          }}
        >
          <span
            style={{
              fontFamily: tokens.font.mono,
              fontSize: '9.5px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: tokens.color.textTertiary,
              fontWeight: 400,
            }}
          >
            {ratio.label}
          </span>
          <span
            style={{
              fontFamily: tokens.font.mono,
              fontSize: '13px',
              fontWeight: 500,
              fontVariantNumeric: 'tabular-nums',
              color: tokens.color.textPrimary,
              letterSpacing: '-0.01em',
            }}
          >
            {formatRatioValue(ratio)}
          </span>
        </div>
      ))}
    </div>
  )
}
