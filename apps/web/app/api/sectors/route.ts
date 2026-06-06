// RATE LIMIT NOTE: This route is public. Add Upstash rate limiting if abuse is detected.
import { NextResponse } from 'next/server'
import type { Sector } from '@/lib/types'

const SECTORS: Sector[] = [
  'Financial Services',
  'AI & Technology',
  'Healthcare',
  'Consumer & Retail',
  'Consumer Internet & Digital Platforms',
]

export async function GET() {
  return NextResponse.json({ sectors: SECTORS })
}
