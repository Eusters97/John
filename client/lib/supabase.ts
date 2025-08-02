import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Environment variables check:', {
    VITE_SUPABASE_URL: supabaseUrl ? 'Set' : 'Missing',
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? 'Set' : 'Missing'
  });
  throw new Error(
    `Missing Supabase environment variables. ` +
    `URL: ${supabaseUrl ? 'Set' : 'Missing'}, ` +
    `Key: ${supabaseAnonKey ? 'Set' : 'Missing'}`
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
