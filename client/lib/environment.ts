// Environment configuration for dual database setup
export const ENV = {
  // Supabase Configuration
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  
  // Neon Configuration
  NEON_DATABASE_URL: import.meta.env.VITE_NEON_DATABASE_URL,
  
  // Database Selection
  USE_NEON: import.meta.env.VITE_USE_NEON === 'true',
  
  // Application Settings
  APP_URL: import.meta.env.VITE_APP_URL || window.location.origin,
  
  // Features
  ENABLE_DUAL_DATABASE: import.meta.env.VITE_ENABLE_DUAL_DATABASE === 'true',
  
  // Development
  DEV_MODE: import.meta.env.DEV,
} as const;

// Validate required environment variables
export function validateEnvironment() {
  const errors: string[] = [];
  
  if (!ENV.SUPABASE_URL) {
    errors.push('VITE_SUPABASE_URL is required');
  }
  
  if (!ENV.SUPABASE_ANON_KEY) {
    errors.push('VITE_SUPABASE_ANON_KEY is required');
  }
  
  if (ENV.USE_NEON && !ENV.NEON_DATABASE_URL) {
    errors.push('VITE_NEON_DATABASE_URL is required when USE_NEON is true');
  }
  
  if (errors.length > 0) {
    console.error('Environment validation failed:', errors);
    throw new Error(`Missing required environment variables: ${errors.join(', ')}`);
  }
  
  return true;
}

// Get current database info
export function getDatabaseInfo() {
  return {
    active: ENV.USE_NEON ? 'Neon' : 'Supabase',
    dualEnabled: ENV.ENABLE_DUAL_DATABASE,
    supabaseConfigured: !!(ENV.SUPABASE_URL && ENV.SUPABASE_ANON_KEY),
    neonConfigured: !!ENV.NEON_DATABASE_URL,
  };
}
