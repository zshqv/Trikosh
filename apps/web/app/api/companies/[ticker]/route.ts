// RATE LIMIT NOTE: This route is public. Add Upstash rate limiting if abuse is detected.

/**
 * GET /api/companies/[ticker]
 *
 * Returns full financial data for a single company across all six DB tables.
 * All financial-data queries run in parallel via Promise.all().
 *
 * Real DB schema (from loader.py — all tables join on ticker directly, no company_id):
 *   companies             — ticker (PK), name, sector, industry, country, exchange, currency
 *   income_statements     — ticker FK, fiscal_year, revenue, gross_profit, operating_income, net_income, ebitda, eps
 *   balance_sheets        — ticker FK, fiscal_year, total_assets, total_liabilities, total_equity, cash_and_equivalents, total_debt
 *   cash_flow_statements  — ticker FK, fiscal_year, operating_cash_flow, capital_expenditure, free_cash_flow, dividends_paid
 *   financial_ratios      — ticker FK, fiscal_year, 15 ratio columns
 *   market_data           — ticker FK, date, market_cap, price, beta, volume_avg, shares_outstanding
 *
 * Response shape:
 * {
 *   company:              companies row
 *   income_statements:    [] up to 5 years, newest first
 *   balance_sheets:       [] up to 5 years, newest first
 *   cash_flow_statements: [] up to 5 years, newest first
 *   financial_ratios:     [] up to 5 years, newest first
 *   market_data:          most recent row | null
 *   peers:                [] same sector, up to 4, excludes self
 * }
 */

import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: NextRequest,
  { params }: { params: { ticker: string } }
) {
  const ticker = params.ticker.toUpperCase()

  try {
    // ------------------------------------------------------------------
    // 1. Resolve company (single round-trip before parallel fan-out)
    // ------------------------------------------------------------------
    const [company] = await query(
      `SELECT * FROM companies WHERE ticker = $1`,
      [ticker]
    )

    if (!company) {
      return NextResponse.json(
        { error: `Company '${ticker}' not found` },
        { status: 404 }
      )
    }

    const sector = (company as { sector: string }).sector

    // ------------------------------------------------------------------
    // 2. Fetch all financial data in parallel — minimise latency
    // ------------------------------------------------------------------
    const [
      incomeRows,
      balanceRows,
      cashflowRows,
      ratioRows,
      marketRows,
      peerRows,
    ] = await Promise.all([

      query(
        `SELECT * FROM income_statements
         WHERE ticker = $1
         ORDER BY fiscal_year DESC
         LIMIT 5`,
        [ticker]
      ),

      query(
        `SELECT * FROM balance_sheets
         WHERE ticker = $1
         ORDER BY fiscal_year DESC
         LIMIT 5`,
        [ticker]
      ),

      query(
        `SELECT * FROM cash_flow_statements
         WHERE ticker = $1
         ORDER BY fiscal_year DESC
         LIMIT 5`,
        [ticker]
      ),

      query(
        `SELECT * FROM financial_ratios
         WHERE ticker = $1
         ORDER BY fiscal_year DESC
         LIMIT 5`,
        [ticker]
      ),

      // market_data orders by date (not fiscal_year) — most recent snapshot
      query(
        `SELECT * FROM market_data
         WHERE ticker = $1
         ORDER BY date DESC
         LIMIT 1`,
        [ticker]
      ),

      // Peers: same sector, exclude self
      query(
        `SELECT ticker, name, sector, country, exchange
         FROM companies
         WHERE sector = $1
           AND ticker != $2
         ORDER BY name
         LIMIT 4`,
        [sector, ticker]
      ),
    ])

    return NextResponse.json({
      company,
      income_statements:    incomeRows,
      balance_sheets:       balanceRows,
      cash_flow_statements: cashflowRows,
      financial_ratios:     ratioRows,
      market_data:          marketRows[0] ?? null,
      peers:                peerRows,
    })

  } catch (err) {
    console.error('[API /api/companies/[ticker]]', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
