// Supabase client for code that runs in the visitor's browser (forms and buttons).
// The login is kept in cookies, so the server can read it too.
import { createBrowserClient } from "@supabase/ssr";
import { supabaseUrl, supabaseKey } from "./config";

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseKey);
}
