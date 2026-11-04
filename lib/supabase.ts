import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Null until the Supabase env vars are set, so the rest of the app still works.
export const supabase: SupabaseClient | null = url && key ? createClient(url, key) : null;

export type Favorite = {
  id: string;
  ku: string;
  pos: string;
  meaning: string;
  example_ku: string;
  example_tr: string;
  note: string;
  lang: string;
  created_at: string;
};
