export default function TrustStrip() {
  return (
    <div
      style={{
        width: '100%',
        backgroundColor: 'var(--bg-surface-2)',
        padding: '12px 24px',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--text-tertiary)',
          margin: 0,
        }}
      >
        Sources: SEC EDGAR · Annual Reports · Investor Presentations{' '}
        | Standards: GAAP / IFRS flagged per company{' '}
        | Coverage: FY2019 – FY2024{' '}
        | License: MIT Open Source
      </p>
    </div>
  )
}
