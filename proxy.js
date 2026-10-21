// Runs before every page loads (Next.js 16 calls this file "proxy"). It does two jobs:
// 1. Keeps the visitor's Supabase login fresh by renewing it in their cookies.
// 2. Sends visitors who aren't logged in from /app to /login.
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { supabaseUrl, supabaseKey, isSupabaseConfigured } from "@/lib/supabase/config";

export async function proxy(request) {
  let response = NextResponse.next({ request });
  const isAppPage = request.nextUrl.pathname === "/app" || request.nextUrl.pathname.startsWith("/app/");

  // Supabase not set up yet: nobody can be logged in, so just protect /app
  if (!isSupabaseConfigured) {
    return isAppPage ? NextResponse.redirect(new URL("/login", request.url)) : response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        // Put the renewed login cookies on the request (for the page)
        // and on the response (so the browser saves them)
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        // Headers that stop anyone caching a page with someone's login in it
        Object.entries(headers || {}).forEach(([key, value]) => response.headers.set(key, value));
      },
    },
  });

  // Checks (and if needed renews) the login. Keep this right after createServerClient.
  const { data } = await supabase.auth.getClaims();
  const isLoggedIn = Boolean(data?.claims);

  if (isAppPage && !isLoggedIn) {
    const redirect = NextResponse.redirect(new URL("/login", request.url));
    // Keep any cookie changes, e.g. removing an expired login
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  }

  return response;
}

// Run on every page, but not on Next.js files, images and the tab icon
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
