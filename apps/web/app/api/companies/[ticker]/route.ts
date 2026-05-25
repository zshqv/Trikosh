import { NextRequest, NextResponse } from 'next/server'
import { COMPANIES, MOCK_CARDS } from '@/lib/mockData'

export async function GET(
  request: NextRequest,
  { params }: { params: { ticker: string } }
) {
  const ticker = params.ticker.toUpperCase()
  const company = COMPANIES.find(c => c.ticker === ticker)

  if (!company) {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 })
  }

  const card = MOCK_CARDS.find(c => c.company.ticker === ticker)
  const peers = COMPANIES.filter(c => c.sector === company.sector && c.ticker !== ticker).slice(0, 4)

  return NextResponse.json({ company, card: card ?? null, peers })
}
