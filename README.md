# InternTrack

Every internship application in one list, for third-year IE students applying for internships.

**Live site:** https://interntrack-omega-ivory.vercel.app

> Student project, not an official IE University service.

## What it does

Sign up with your email and a password, then add each internship application by typing the company and role. Change its status as you hear back (Applied, Interview, Offer, Rejected) and see your totals at a glance. Your list is saved in a database, and only you can see it.

## Set it up (one time)

1. **Supabase project:** on [supabase.com](https://supabase.com), create a project in a European region.
2. **Turn off email confirmation:** go to **Authentication → Sign In / Providers → Email**, keep Email on, turn **Confirm email** off, and save.
3. **Add your keys:** click **Connect** at the top of your project dashboard and copy the **Project URL** and the **publishable key** (`sb_publishable_…`). Paste them into the file `.env.local` in the main project folder (next to `package.json`; create it if it isn't there):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://abcd1234.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxx
   ```
   Can't find **Connect**? The key is under **Project Settings → API Keys**, and the URL is under **Integrations → Data API**. Never use the secret key (`sb_secret_…` or `service_role`).
4. **Create the table:** in Supabase, open **SQL Editor → New query**, paste everything from [`supabase/schema.sql`](supabase/schema.sql) and click **Run**.

## Run it on your laptop

You need Node.js 20.9 or newer (the LTS installer from nodejs.org). Open a terminal in the `interntrack` folder, then run:

```bash
npm install
npm run dev
```

Then open http://localhost:3000. If you change `.env.local`, stop the server (Ctrl+C) and run `npm run dev` again.

## Put it online

1. **GitHub:** in GitHub Desktop, choose **File → Add local repository…**, pick the `interntrack` folder, then click **Publish repository**. **Untick "Keep this code private"**: the repository must be public. `.env.local` is never uploaded.
2. **Vercel:** on [vercel.com](https://vercel.com), choose **Add New… → Project** and import the repository. Under **Environment Variables**, add the same 2 lines as in `.env.local`, then click **Deploy**. If you add or change these variables later, go to **Deployments → ⋯ → Redeploy**: the site only picks them up on a new deployment.
3. **Your link:** use the short one from **Settings → Domains** (`https://<project-name>.vercel.app`).
4. **Tell Supabase your link:** go to **Authentication → URL Configuration**, set **Site URL** to that link, add it under **Redirect URLs** too, and save.

Every time you push to GitHub, Vercel updates the site automatically.

## How it's built

| File | What it does |
| --- | --- |
| `app/page.js` | Landing page at `/` |
| `app/signup/page.js`, `app/login/page.js` | Sign-up and login pages, using `components/AuthForm.js` |
| `app/app/page.js` | The main feature at `/app` (logged-in users only), using `components/ApplicationsBoard.js` |
| `app/layout.js` | The header and footer on every page |
| `components/AuthNav.js` | Top right of the header: **Log in**, or **My list**, your email and **Log out** |
| `proxy.js` | Runs before each page: keeps the login fresh and sends logged-out visitors from `/app` to `/login` |
| `lib/supabase/` | Connects to Supabase from the browser and from the server (`config.js` reads the two keys) |
| `supabase/schema.sql` | The database table and its Row Level Security rules |
| `vercel.json` | Runs the server code in Vercel's Stockholm region (`arn1`), next to the Supabase database, so data stays in Europe |
| `CLAUDE.md` | The EdTech Challenge grading contract |

## Privacy

- The app stores each user's email, their password (scrambled by Supabase, so nobody can read it) and the applications they add. Supabase also keeps standard sign-in logs (time, IP address, browser).
- Row Level Security means every user can only read and change their own rows. Visitors who aren't logged in can't read anything.
- The Montserrat font is served from this site, so visitors' browsers don't contact Google.
