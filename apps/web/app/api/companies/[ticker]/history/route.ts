/**
 * GET /api/companies/[ticker]/history?years=5
 *
 * Returns 5-year daily OHLCV price history for a company.
 * The window is always computed from today's date — never a static snapshot.
 *
 * Data source priority:
 *   1. Python FastAPI (main.py) at PYTHON_API_URL if running
 *   2. yfinance via direct HTTP call to the FastAPI endpoint
 *
 * Response shape:
 * {
 *   ticker:  string
 *   years:   number
 *   start:   string  // ISO date
 *   end:     string  // ISO date (today)
 *   rows: Array<{ date: string; open: number; high: number; low: number; close: number; volume: number }>
 * }
 */

import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

const PYTHON_API_URL = process.env.PYTHON_API_URL ?? 'http://localhost:8000'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker: rawTicker } = await params
  const ticker = rawTicker.toUpperCase()

  if (!/^[A-Z0-9.\-]{1,20}$/.test(ticker)) {
    return NextResponse.json({ error: 'Invalid ticker format' }, { status: 400 })
  }

  const { searchParams } = new URL(request.url)
  const years = Math.min(Math.max(parseInt(searchParams.get('years') ?? '5', 10), 1), 10)

  try {
    const upstream = await fetch(
      `${PYTHON_API_URL}/api/companies/${encodeURIComponent(ticker)}/history?years=${years}`,
      { signal: AbortSignal.timeout(15_000) }
    )

    if (!upstream.ok) {
      const body = await upstream.json().catch(() => ({}))
      return NextResponse.json(
        { error: body.detail ?? `Upstream returned ${upstream.status}` },
        { status: upstream.status }
      )
    }

    const data = await upstream.json()
    return NextResponse.json(data)

  } catch (err) {
    console.error(`[API /api/companies/${ticker}/history]`, err instanceof Error ? err.message : String(err))
    return NextResponse.json(
      { error: 'Price history unavailable' },
      { status: 503 }
    )
  }
}
