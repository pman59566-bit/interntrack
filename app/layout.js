import { Montserrat } from "next/font/google";
import Link from "next/link";
import { connection } from "next/server";
import "./globals.css";
import AuthNav from "@/components/AuthNav";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

// Montserrat is downloaded once when the site is built and then served from
// this site, so visitors' browsers never contact Google.
const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata = {
  title: "InternTrack – every internship application in one list",
  description:
    "For third-year IE students applying for internships: keep every application in one list and always know what to follow up on.",
};

// The frame around every page: header, main content and footer
export default async function RootLayout({ children }) {
  // Build every page when someone visits it (not once in advance),
  // because the header depends on who's logged in
  await connection();

  // Find out who's logged in, to show their email and the "Log out" button
  let userEmail = null;
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    // ?. means "if this part is missing, stop here instead of crashing" (logged-out visitors have no claims)
    // ?? null means "if there's nothing, use null"
    userEmail = data?.claims?.email ?? null;
  }

  return (
    <html lang="en" className={montserrat.variable}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>

        <header className="site-header">
          <div className="container header-inner">
            <Link href="/" className="brand">
              InternTrack
            </Link>
            <AuthNav initialEmail={userEmail} />
          </div>
        </header>

        {!isSupabaseConfigured && (
          <div className="container">
            <p className="setup-warning">
              {/* NEXT_PUBLIC_ values are read when the site is built, so Vercel needs a new deployment */}
              <strong>Setup needed:</strong> the app isn&apos;t connected to Supabase yet. Add your Project URL and
              publishable key to <code>.env.local</code> and restart <code>npm run dev</code>. On Vercel, add them
              under Settings → Environment Variables, then redeploy (Deployments → ⋯ → Redeploy).
            </p>
          </div>
        )}

        <main id="main" className="container">
          {children}
        </main>

        <footer className="site-footer">
          <div className="container">
            <p>Student project, not an official IE University service.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
