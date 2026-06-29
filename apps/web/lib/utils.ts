import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { DeltaDirection, Sector } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number, currency = 'USD'): string {
  const symbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'JPY' ? '¥' : '$'
  if (Math.abs(value) >= 1e9) return `${symbol}${(value / 1e9).toFixed(1)}B`
  if (Math.abs(value) >= 1e6) return `${symbol}${(value / 1e6).toFixed(1)}M`
  if (Math.abs(value) >= 1e3) return `${symbol}${Math.round(value / 1e3)}K`
  return `${symbol}${Math.round(value)}`
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}

export function formatMultiple(value: number): string {
  return `${value.toFixed(1)}×`
}

export function formatDelta(value: number): string {
  const pct = (value * 100).toFixed(1)
  if (value > 0.001) return `▲ +${pct}%`
  if (value < -0.001) return `▼ ${pct}%`
  return `— 0.0%`
}

export function formatDate(isoString: string): string {
  const d = new Date(isoString)
  const yyyy = d.getUTCFullYear()
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(d.getUTCDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function getDeltaDirection(value: number): DeltaDirection {
  if (value > 0.001) return 'positive'
  if (value < -0.001) return 'negative'
  return 'neutral'
}

export function isStaleData(isoDate: string): boolean {
  const date = new Date(isoDate)
  const now = new Date()
  const diffDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  return diffDays > 180
}

export function getSectorMetrics(sector: Sector): string[] {
  if (sector === 'Financial Services') return ['ROE', 'Net Interest Margin', 'CET1 Ratio']
  if (sector === 'Healthcare') return ['Gross Margin', 'R&D % Revenue', 'Revenue Growth']
  return ['FCF Margin', 'Revenue Growth', 'R&D Intensity']
}
