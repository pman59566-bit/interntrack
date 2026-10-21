// The two PUBLIC Supabase values, from .env.local on your laptop
// or from the Environment Variables in Vercel.
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// false until both values are filled in (the app then shows a setup message)
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);
