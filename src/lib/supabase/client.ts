import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[SEISMOS] Supabase credentials not configured. Running in demo mode.');
}

export const supabase = createClient<Database>(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key',
    {
        realtime: {
            params: {
                eventsPerSecond: 10,
            },
        },
    }
);

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
