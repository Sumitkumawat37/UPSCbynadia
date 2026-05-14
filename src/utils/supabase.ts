import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://naysnsxwazrvxfbtmrbn.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_aYEAYkzTtU9dt58ZEPetNw_n5cB3P9G';

export const supabase = createClient(supabaseUrl, supabaseKey);
