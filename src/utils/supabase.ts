import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tzlpuvdabpulbnmlvkrl.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_qZ9K34o1htErZbaneF3X9w_58MjxbFP';

export const supabase = createClient(supabaseUrl, supabaseKey);
