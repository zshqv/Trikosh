/**
 * lib/db.ts — PostgreSQL connection pool
 *
 * Uses the `pg` library with a singleton Pool so that Next.js hot-reload
 * in development doesn't leak connections by creating a new Pool on every
 * module re-evaluation. The global singleton pattern is the standard fix.
 *
 * Credentials are read from .env.local (server-side only — no NEXT_PUBLIC_ prefix).
 * Required vars: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
 */

import { Pool, QueryResultRow } from 'pg'

// ---------------------------------------------------------------------------
// Singleton pool — one instance per process, shared across all route handlers
// ---------------------------------------------------------------------------

declare global {
  // eslint-disable-next-line no-var
  var _trikoshPool: Pool | undefined
}

function createPool(): Pool {
  return new Pool({
    host:     process.env.DB_HOST     ?? 'localhost',
    port:     parseInt(process.env.DB_PORT ?? '5432', 10),
    database: process.env.DB_NAME     ?? 'trikosh',
    user:     process.env.DB_USER     ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    // Keep a small pool — API routes are short-lived
    max:                10,
    idleTimeoutMillis:  30_000,
    connectionTimeoutMillis: 5_000,
  })
}

const pool: Pool =
  process.env.NODE_ENV === 'production'
    ? createPool()                         // always fresh in prod
    : (globalThis._trikoshPool ??= createPool())  // reuse in dev across HMR

export default pool

// ---------------------------------------------------------------------------
// query() — convenience wrapper around pool.connect() + release
// ---------------------------------------------------------------------------

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const client = await pool.connect()
  try {
    const result = await client.query<T>(text, params)
    return result.rows
  } finally {
    client.release()
  }
}
