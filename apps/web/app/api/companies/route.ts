import { NextRequest, NextResponse } from 'next/server'
import { COMPANIES, MOCK_CARDS } from '@/lib/mockData'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sector = searchParams.get('sector')
  const limit = parseInt(searchParams.get('limit') ?? '20')
  const offset = parseInt(searchParams.get('offset') ?? '0')

  let result = COMPANIES.slice()
  if (sector) result = result.filter(c => c.sector === sector)

  const paginated = result.slice(offset, offset + limit)
  return NextResponse.json({ companies: paginated, total: result.length })
}
