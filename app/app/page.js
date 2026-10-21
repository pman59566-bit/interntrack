import { redirect } from "next/navigation";
import { connection } from "next/server";
import ApplicationsBoard from "@/components/ApplicationsBoard";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata = { title: "Your applications – InternTrack" };

// The main feature at "/app", only for logged-in users
export default async function AppPage() {
  await connection(); // check the login on every visit, never build this page in advance
  if (!isSupabaseConfigured) redirect("/login");

  // Not logged in? Go to the login page (proxy.js does this too, this is a second check)
  const supabase = await createClient();
  const { data: login } = await supabase.auth.getClaims();
  if (!login?.claims) redirect("/login");

  // Row Level Security makes sure this only returns this user's own rows
  const { data: applications, error } = await supabase
    .from("applications")
    .select("id, title, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="app-page">
      <h1>Your applications</h1>
      {error && (
        <p className="form-error" role="alert">
          <span aria-hidden="true">⚠ </span>
          Couldn&apos;t load your applications: {error.message}. If it says the table doesn&apos;t exist, run{" "}
          <code>supabase/schema.sql</code> in Supabase → SQL Editor.
        </p>
      )}
      <ApplicationsBoard initialApplications={applications ?? []} />
    </div>
  );
}
