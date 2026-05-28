/**
 * lib/db.ts — PostgreSQL connection pool
 */
import { Pool, QueryResultRow } from 'pg'

declare global {
  // eslint-disable-next-line no-var
  var _trikoshPool: Pool | undefined
}

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL

  console.log('[db.ts] DATABASE_URL present:', !!connectionString)
  console.log('[db.ts] DATABASE_URL starts with:', connectionString?.substring(0, 30))

  if (connectionString) {
    return new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max:                     10,
      idleTimeoutMillis:       30_000,
      connectionTimeoutMillis: 5_000,
    })
  }

  return new Pool({
    host:     process.env.DB_HOST     ?? 'localhost',
    port:     parseInt(process.env.DB_PORT ?? '5432', 10),
    database: process.env.DB_NAME     ?? 'trikosh',
    user:     process.env.DB_USER     ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    ssl: { rejectUnauthorized: false },
    max:                     10,
    idleTimeoutMillis:       30_000,
    connectionTimeoutMillis: 5_000,
  })
}

const pool: Pool =
  process.env.NODE_ENV === 'production'
    ? createPool()
    : (globalThis._trikoshPool ??= createPool())

export default pool

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