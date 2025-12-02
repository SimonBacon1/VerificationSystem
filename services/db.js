import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function initDb(){
  await pool.query(`
    CREATE TABLE IF NOT EXISTS verifications (
      id UUID PRIMARY KEY,
      shopify_customer_id BIGINT,
      email TEXT,
      status TEXT,
      suma_id TEXT,
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now(),
      raw_response JSONB
    );
  `);
}

export default pool;
