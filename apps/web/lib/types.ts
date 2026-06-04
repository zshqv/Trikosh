export type Sector = 'Financial Services' | 'AI & Technology' | 'Healthcare' | 'Consumer & Retail' | 'Consumer Internet & Digital Platforms' | 'Industrials'
export type Standard = 'GAAP' | 'IFRS' | 'Non-GAAP'
export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY'
export type MetricUnit = 'USD' | 'PCT' | 'RATIO' | 'MULTIPLE'
export type DeltaDirection = 'positive' | 'negative' | 'neutral'
export type CardState = 'rest' | 'hover' | 'active' | 'loading' | 'stale' | 'pinned'

export interface Company {
  ticker: string
  exchange: string
  name: string
  sector: Sector
  industry: string
  analyticalLens: string
}

export interface FinancialMetric {
  label: string
  value: number
  unit: MetricUnit
  period: string
  delta?: number
  isEstimate?: boolean
}

export interface DataSource {
  source: 'SEC 10-K' | 'SEC 10-Q' | 'Annual Report' | 'Investor Presentation'
  standard: Standard
  period: string
  updatedAt: string
  currency: Currency
}

export interface CardData {
  company: Company
  primaryMetric: FinancialMetric
  secondaryMetric?: FinancialMetric
  ratios: FinancialMetric[]
  sparkline: number[]
  source: DataSource
  isPinned?: boolean
  isStale?: boolean
}

export interface PeriodValue {
  period: string
  value: number
  delta?: number
}

export interface GlossaryTerm {
  term: string
  definition: string
  analystNote?: string
  relatedTickers?: string[]
}

export interface ResearchKit {
  id: string
  title: string
  description: string
  sector: Sector
  tickers: string[]
  metrics: string[]
}

export interface SectorSnapshot {
  sector: Sector
  avgGrossMargin: number
  avgROE: number
  avgRevenueGrowth: number
  companyCount: number
  analyticalFramework: string
  keyValueDrivers: string[]
  sectorRisks: string[]
}
