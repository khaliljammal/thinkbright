import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { storage } from './storage';
import { env, isSupabaseConfigured } from './env';

/** Supabase's web default is localStorage, which RN doesn't have. */
const secureStorage = {
  getItem: (k: string) => storage.get(k),
  setItem: (k: string, v: string) => storage.set(k, v),
  removeItem: (k: string) => storage.remove(k),
};

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(env.supabaseUrl, env.supabaseAnonKey, {
      auth: {
        storage: secureStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;

export function requireSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env — see README.',
    );
  }
  return supabase;
}
