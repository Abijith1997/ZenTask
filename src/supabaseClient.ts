import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL: string = import.meta.env.VITE_SUPABASE_URL!;
const SUPABASE_ANON_KEY: string = import.meta.env.VITE_SUPABASE_ANON_KEY!;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Supabase environment variables are missing!");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
