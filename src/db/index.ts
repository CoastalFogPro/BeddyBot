import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Use NETLIFY_DATABASE_URL in production (Netlify), DATABASE_URL locally
const connectionString = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL or NETLIFY_DATABASE_URL is missing');
}

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
