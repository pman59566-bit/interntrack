"use client";

// One form for both pages: mode="signup" on /signup and mode="login" on /login.
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Turn Supabase's error messages into plain English
function friendlyError(error) {
  // No internet, or Supabase is down
  if (error.name === "AuthRetryableFetchError") {
    return "The app can't reach Supabase right now. Check your internet and try again.";
  }
  const message = (error.message || "").toLowerCase();
  if (message.includes("invalid login credentials")) return "Wrong email or password. Please try again.";
  if (message.includes("already registered")) return "There's already an account with this email. Log in instead.";
  if (message.includes("password should be")) return "Your password needs at least 6 characters.";
  return "Something went wrong: " + error.message;
}

export default function AuthForm({ mode }) {
  const isSignup = mode === "signup";
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  // The button only works once the page's JavaScript has loaded
  // (clicking earlier would just reload the page and lose what was typed)
  useEffect(() => {
    setReady(true);
  }, []);

  async function handleSubmit(event) {
    event.preventDefault(); // stop the browser reloading the page
    if (loading) return; // already sending: ignore extra clicks

    // Read the boxes directly, so text typed while the page was still loading counts too
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    setError("");
    setNotice("");
    setLoading(true);

    let result;
    try {
      const supabase = createClient();
      result = isSignup
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });
    } catch {
      // Only happens when the Supabase keys are missing (see the setup message at the top)
      setLoading(false);
      setError("The app isn't connected to Supabase yet. See the setup message at the top of the page.");
      return;
    }

    if (result.error) {
      setLoading(false); // stay on this page so the person can try again
      setError(friendlyError(result.error));
      return;
    }
    // No session means Supabase still has "Confirm email" turned on
    if (!result.data.session) {
      setLoading(false);
      setNotice("Check your email to confirm your account, then log in.");
      return;
    }
    // Success: the button keeps saying "Please wait…" until /app has loaded
    router.push("/app");
    router.refresh(); // reload the server parts of the page, which are now logged in
  }

  return (
    // method="post" keeps the password out of the address bar, just in case
    <form className="auth-form" method="post" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          data-testid={isSignup ? "signup-email" : "login-email"}
        />
      </div>

      <div className="field">
        <label htmlFor="password">Password</label>
        {isSignup && (
          <p id="password-hint" className="hint">
            At least 6 characters.
          </p>
        )}
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={isSignup ? "new-password" : "current-password"}
          required
          minLength={isSignup ? 6 : undefined}
          aria-describedby={isSignup ? "password-hint" : undefined}
          data-testid={isSignup ? "signup-password" : "login-password"}
        />
      </div>

      {error && (
        <p className="form-error" role="alert">
          <span aria-hidden="true">⚠ </span>
          {error}
        </p>
      )}
      {notice && (
        <p className="form-notice" role="status">
          {notice}
        </p>
      )}

      <button
        type="submit"
        className="button button-large"
        disabled={!ready}
        aria-disabled={loading}
        data-testid={isSignup ? "signup-submit" : "login-submit"}
      >
        {loading ? "Please wait…" : isSignup ? "Create account" : "Log in"}
      </button>

      <p className="switch-link">
        {isSignup ? "Already have an account? " : "New here? "}
        <Link href={isSignup ? "/login" : "/signup"}>{isSignup ? "Log in" : "Sign up"}</Link>
      </p>
    </form>
  );
}
