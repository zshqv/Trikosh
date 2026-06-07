// RATE LIMIT NOTE: This route is public. Add Upstash rate limiting if abuse is detected.

/**
 * GET /api/companies
 *
 * Returns all companies from the PostgreSQL `companies` table.
 * Schema: ticker (PK), name, sector, industry, country, exchange, currency, description, website, created_at
 *
 * Query params:
 *   sector  – filter by sector name (e.g. "Financial Services")
 *   limit   – page size, default 200, max 200
 *   offset  – pagination offset, default 0
 *
 * Response: { companies: Company[], total: number }
 */
import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sector = searchParams.get('sector')
  const limit  = Math.min(parseInt(searchParams.get('limit')  ?? '200', 10), 200)
  const offset = Math.max(parseInt(searchParams.get('offset') ?? '0',  10), 0)
  try {
    // Build WHERE clause
    const conditions: string[] = []
    const baseParams: unknown[] = []
    if (sector) {
      baseParams.push(sector)
      conditions.push(`sector = $${baseParams.length}`)
    }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    // Total count
    const [{ count }] = await query<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM companies ${where}`,
      baseParams
    )
    const total = parseInt(count, 10)
    // Paginated rows
    const dataParams = [...baseParams, limit, offset]
    const companies = await query(
      `SELECT
         ticker,
         name,
         sector,
         industry,
         country,
         exchange,
         currency,
         website,
         created_at
       FROM companies
       ${where}
       ORDER BY sector, name
       LIMIT  $${dataParams.length - 1}
       OFFSET $${dataParams.length}`,
      dataParams
    )
    return NextResponse.json({ companies, total })
  } catch (err) {
    console.error('[API /api/companies]', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}