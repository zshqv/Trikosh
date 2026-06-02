export default function TrustStrip() {
  return (
    <div
      style={{
        width: '100%',
        backgroundColor: 'var(--bg-base)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '10px 32px',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: 'var(--text-tertiary)',
          margin: 0,
          letterSpacing: '0.04em',
        }}
      >
        SEC EDGAR · Annual Reports · Investor Presentations
        {' · '}GAAP / IFRS flagged per company
        {' · '}FY2019–FY2024
        {' · '}MIT Open Source
      </p>
    </div>
  )
}
