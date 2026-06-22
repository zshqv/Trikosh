import type { DataSource } from '@/lib/types'
import MetaBadge from '@/components/ui/MetaBadge'
import { formatDate } from '@/lib/utils'
import { tokens } from '@/lib/tokens'

interface MetaStripProps {
  source: DataSource
  isStale?: boolean
}

export default function MetaStrip({ source, isStale }: MetaStripProps) {
  const standard = source.standard.toLowerCase() as 'gaap' | 'ifrs'
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        <span
          style={{
            fontFamily: tokens.font.mono,
            fontSize: '10px',
            color: tokens.color.textTertiary,
          }}
        >
          SRC: {source.source} · {source.period}
        </span>
        <span
          style={{
            fontFamily: tokens.font.mono,
            fontSize: '10px',
            color: isStale ? tokens.color.deltaWarn : tokens.color.textTertiary,
          }}
        >
          Updated: {formatDate(source.updatedAt)}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
        <MetaBadge label={source.standard} variant={standard === 'gaap' ? 'gaap' : 'ifrs'} />
        <MetaBadge label="SEC" variant="sec" />
        {isStale && <MetaBadge label="STALE" variant="warn" />}
      </div>
    </div>
  )
}
