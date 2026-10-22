import Link from "next/link";

// Made-up rows for the preview, just to show what the list looks like
const EXAMPLE_APPLICATIONS = [
  { title: "Summer Analyst, investment bank", status: "Interview" },
  { title: "Marketing Intern, consumer goods", status: "Applied" },
  { title: "Strategy Intern, consulting firm", status: "Offer" },
];

// The public landing page at "/"
export default function HomePage() {
  return (
    <div className="landing">
      <section className="hero" aria-labelledby="hero-heading">
        <p className="eyebrow">For third-year IE University students applying for internships</p>
        <h1 id="hero-heading">Every internship application in one list</h1>
        <p className="lead">
          Add each application in seconds, update its status as you hear back, and see where you stand at a glance,
          instead of in a messy spreadsheet.
        </p>
        <Link href="/signup" className="button button-large">
          Sign up free
        </Link>
        {/* Said near the button too, so nobody mistakes this for an official IE tool */}
        <p className="small-print">
          A free student project, not an official IE University service. Only you can see your list.
        </p>
        <p className="small-print">
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </section>

      <section className="preview" aria-labelledby="preview-heading">
        <h2 id="preview-heading" className="preview-heading">
          What your list looks like
        </h2>
        <ul className="application-list" role="list">
          {EXAMPLE_APPLICATIONS.map((app) => (
            <li key={app.title} className="application">
              <p className="application-title">{app.title}</p>
              <p className="status-tag" data-status={app.status}>
                {app.status}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="how-heading">
        <h2 id="how-heading">How it works</h2>
        <ol className="steps">
          <li>
            <strong>Sign up</strong> with your email and a password.
          </li>
          <li>
            <strong>Add an application</strong> by typing the company and role.
          </li>
          <li>
            <strong>Update its status</strong>: Applied, Interview, Offer or Rejected.
          </li>
        </ol>
      </section>
    </div>
  );
}
