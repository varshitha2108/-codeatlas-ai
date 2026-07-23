import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import { pool } from '../config/db'

async function runMigrations() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `)

  const migrationsDir = join(__dirname, 'migrations')
  const files = readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort()

  for (const file of files) {
    const alreadyApplied = await pool.query(
      'SELECT 1 FROM schema_migrations WHERE filename = $1',
      [file]
    )

    if (alreadyApplied.rowCount && alreadyApplied.rowCount > 0) {
      console.log(`Skipping ${file} (already applied)`)
      continue
    }

    const sql = readFileSync(join(migrationsDir, file), 'utf-8')
    console.log(`Applying ${file}...`)
    await pool.query(sql)
    await pool.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [file])
    console.log(`✓ ${file} applied`)
  }

  console.log('All migrations up to date.')
  await pool.end()
}

runMigrations().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})