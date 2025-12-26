import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Use NETLIFY_DATABASE_URL in production (Netlify), DATABASE_URL locally
const connectionString = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
    console.error('CRITICAL: DATABASE_URL is missing. DB operations will fail.');
    // Don't throw here, or it breaks build/imports
}

const sql = neon(connectionString || 'postgres://placeholder');
export const db = drizzle(sql, { schema });
