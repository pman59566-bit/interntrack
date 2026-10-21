"use client";

// Top right of every page: "Log in" when logged out,
// or the user's email and the "Log out" button when logged in.
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function AuthNav({ initialEmail }) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail);

  // Update straight away when someone logs in or out (no page reload needed)
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => data.subscription.unsubscribe(); // stop listening when the page closes
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setEmail(null);
    router.push("/login");
    router.refresh(); // reload the server parts of the page, which are now logged out
  }

  if (email) {
    return (
      <nav className="auth-nav" aria-label="Account">
        {/* A quick way back to the list from any page */}
        <Link href="/app" className="nav-link">
          My list
        </Link>
        <span className="auth-email">{email}</span>
        <button type="button" className="button button-secondary" data-testid="logout" onClick={handleLogout}>
          Log out
        </button>
      </nav>
    );
  }

  return (
    <nav className="auth-nav" aria-label="Account">
      <Link href="/login" className="nav-link">
        Log in
      </Link>
    </nav>
  );
}
