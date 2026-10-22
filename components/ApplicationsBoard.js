"use client";

// The main feature on /app: add an application, change its status, remove it.
// Everything is saved in the Supabase "applications" table.
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const STATUSES = ["Applied", "Interview", "Offer", "Rejected"];

// "2026-10-21T09:30:00Z" -> "21 Oct" (Madrid time, the same on server and browser)
function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "Europe/Madrid" });
}

// (1, "application") -> "1 application", (3, "application") -> "3 applications"
function pluralize(count, word) {
  return count + " " + word + (count === 1 ? "" : "s");
}

export default function ApplicationsBoard({ initialApplications }) {
  const [applications, setApplications] = useState(initialApplications);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // The Add button only works once the page's JavaScript has loaded
  useEffect(() => {
    setReady(true);
  }, []);

  async function handleAdd(event) {
    event.preventDefault(); // stop the browser reloading the page
    if (saving) return; // already saving: ignore extra clicks

    const form = event.currentTarget; // remember the form, we need it again after saving
    const text = String(new FormData(form).get("title") || "").trim();
    if (text === "") {
      setError("Type the company and role first.");
      return;
    }
    setError("");
    setSaving(true);

    // Status and date get their default values in the database
    const supabase = createClient();
    const { data, error } = await supabase
      .from("applications")
      .insert({ title: text })
      .select("id, title, status, created_at")
      .single();
    setSaving(false);

    if (error) {
      setError("Couldn't save it: " + error.message);
      return;
    }
    // "current" is always the newest list, even if another change finished first
    setApplications((current) => [data, ...current]); // newest first
    form.reset(); // empty the box for the next one
  }

  async function handleStatusChange(id, status) {
    const oldApplication = applications.find((app) => app.id === id);
    const oldStatus = oldApplication ? oldApplication.status : "Applied";

    // Show the new status straight away, then save it
    setApplications((current) => current.map((app) => (app.id === id ? { ...app, status } : app)));
    const supabase = createClient();
    const { error } = await supabase.from("applications").update({ status }).eq("id", id);

    if (error) {
      // Saving failed: put the old status back
      setApplications((current) => current.map((app) => (app.id === id ? { ...app, status: oldStatus } : app)));
      setError("Couldn't change the status: " + error.message);
    }
  }

  async function handleRemove(app) {
    if (!window.confirm("Remove “" + app.title + "” from your list?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("applications").delete().eq("id", app.id);
    if (error) {
      setError("Couldn't remove it: " + error.message);
      return;
    }
    setApplications((current) => current.filter((other) => other.id !== app.id));
  }

  const interviews = applications.filter((app) => app.status === "Interview").length;
  const offers = applications.filter((app) => app.status === "Offer").length;

  return (
    <>
      <form className="add-form" method="post" onSubmit={handleAdd}>
        <label htmlFor="new-application">Company and role</label>
        <p id="new-application-hint" className="hint">
          For example: Summer Analyst, investment bank
        </p>
        <div className="add-row">
          <input
            id="new-application"
            name="title"
            type="text"
            maxLength={200}
            autoComplete="off"
            aria-describedby="new-application-hint"
            data-testid="core-input"
          />
          <button
            type="submit"
            className="button"
            disabled={!ready}
            aria-disabled={saving}
            data-testid="core-submit"
          >
            {saving ? "Adding…" : "Add"}
          </button>
        </div>
        {error && (
          <p className="form-error" role="alert">
            <span aria-hidden="true">⚠ </span>
            {error}
          </p>
        )}
      </form>

      <section aria-labelledby="list-heading">
        <h2 id="list-heading">Your list</h2>
        {/* role="status": screen readers read out the new totals after every change */}
        <p className="summary" role="status">
          {pluralize(applications.length, "application")} · {pluralize(interviews, "interview")} ·{" "}
          {pluralize(offers, "offer")}
        </p>

        {applications.length === 0 ? (
          <p className="empty">No applications yet. Add your first one above.</p>
        ) : (
          <ul className="application-list" role="list">
            {applications.map((app) => (
              <li key={app.id} className="application" data-testid="core-item">
                <p className="application-title">{app.title}</p>
                <p className="application-date">Added {formatDate(app.created_at)}</p>
                <div className="application-controls">
                  {/* aria-label: the name screen readers hear, so the title isn't repeated on the page */}
                  <select
                    className="status-select"
                    data-status={app.status}
                    aria-label={"Status of " + app.title}
                    value={app.status}
                    onChange={(event) => handleStatusChange(app.id, event.target.value)}
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="button button-secondary"
                    aria-label={"Remove " + app.title}
                    onClick={() => handleRemove(app)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
