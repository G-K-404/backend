// backend/db.js
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: 'postgresql://postgres.vmzobkzlbwvqktrpcefq:Avinash69420!@aws-0-us-east-2.pooler.supabase.com:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;
