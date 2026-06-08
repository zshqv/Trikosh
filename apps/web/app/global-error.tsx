'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          backgroundColor: '#131313',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: '"DM Sans", sans-serif',
        }}
      >
        <p
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '11px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#c9a96e',
            marginBottom: '16px',
          }}
        >
          Fatal error{error.digest ? ` · ${error.digest}` : ''}
        </p>

        <h1
          style={{
            fontFamily: '"Bodoni Moda", serif',
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: 700,
            color: '#e5e2e1',
            margin: '0 0 12px',
            textAlign: 'center',
          }}
        >
          Something went wrong
        </h1>

        <p
          style={{
            fontSize: '15px',
            color: '#8e9192',
            textAlign: 'center',
            maxWidth: '400px',
            lineHeight: 1.6,
            marginBottom: '40px',
          }}
        >
          A critical error occurred. Please try again.
        </p>

        <button
          onClick={reset}
          style={{
            padding: '10px 24px',
            border: '1px solid rgba(201,169,110,0.4)',
            borderRadius: '6px',
            backgroundColor: 'transparent',
            color: '#c9a96e',
            fontSize: '14px',
            fontFamily: 'inherit',
            cursor: 'pointer',
            letterSpacing: '0.04em',
          }}
        >
          Try again
        </button>
      </body>
    </html>
  )
}
