import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export const supabase = createClientComponentClient<Database>({
  supabaseUrl,
  supabaseKey: supabaseAnonKey,
})

// Server-side Supabase client
export const createServerSupabaseClient = () => createServerComponentClient<Database>({
  supabaseUrl,
  supabaseKey: supabaseAnonKey,
})

// Admin client for server-side operations (optional)
export const createSupabaseAdmin = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY not found, using anon key for admin operations');
  }
  
  return createClient<Database>(
    supabaseUrl,
    serviceKey || supabaseAnonKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}
