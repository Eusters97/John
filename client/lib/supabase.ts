import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if environment variables are set and not placeholder values
const isPlaceholderUrl = !supabaseUrl || supabaseUrl === 'your_supabase_project_url' || supabaseUrl.includes('your_project');
const isPlaceholderKey = !supabaseAnonKey || supabaseAnonKey === 'your_supabase_anon_key' || supabaseAnonKey.includes('your_');

if (isPlaceholderUrl || isPlaceholderKey) {
  console.error('Supabase configuration issue:', {
    VITE_SUPABASE_URL: supabaseUrl || 'Missing',
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? (supabaseAnonKey.length > 20 ? 'Set' : 'Invalid') : 'Missing',
    isPlaceholderUrl,
    isPlaceholderKey
  });

  const errorMessage = isPlaceholderUrl && isPlaceholderKey
    ? 'Supabase URL and API key are not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.'
    : isPlaceholderUrl
    ? 'Supabase URL is not configured. Please set VITE_SUPABASE_URL environment variable.'
    : 'Supabase API key is not configured. Please set VITE_SUPABASE_ANON_KEY environment variable.';

  throw new Error(errorMessage);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
