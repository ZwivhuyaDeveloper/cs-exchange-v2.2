import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
  // Updated path

const sql = neon(process.env.DATABASE_URL!);
