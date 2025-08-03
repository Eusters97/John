import { neon } from '@neondatabase/serverless';

const neonUrl = import.meta.env.VITE_NEON_DATABASE_URL;

if (!neonUrl) {
  console.error('Environment variables check:', {
    VITE_NEON_DATABASE_URL: neonUrl ? 'Set' : 'Missing'
  });
  throw new Error(
    `Missing Neon environment variables. ` +
    `URL: ${neonUrl ? 'Set' : 'Missing'}`
  );
}

export const sql = neon(neonUrl);

// Helper function to execute Neon queries
export async function executeNeonQuery<T = any>(
  query: string,
  params: any[] = []
): Promise<T[]> {
  try {
    const result = await sql(query, params);
    return result as T[];
  } catch (error) {
    console.error('Neon query error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      query: query.substring(0, 100) + '...',
      params
    });
    throw error;
  }
}

// Test Neon connection
export async function testNeonConnection(): Promise<boolean> {
  try {
    const result = await sql`SELECT NOW() as timestamp`;
    console.log('Neon connection successful:', result[0]);
    return true;
  } catch (error) {
    console.error('Neon connection failed:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return false;
  }
}
