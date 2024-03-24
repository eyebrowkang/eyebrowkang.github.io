import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUP_PROJECT_URL,
  import.meta.env.VITE_SUP_ANON_KEY,
);
