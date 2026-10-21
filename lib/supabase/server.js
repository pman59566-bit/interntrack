// Supabase client for code that runs on the server (pages and layouts).
// It reads the visitor's login from their cookies.
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseUrl, supabaseKey } from "./config";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Pages aren't allowed to change cookies. That's fine:
          // proxy.js already renews the login before the page runs.
        }
      },
    },
  });
}
