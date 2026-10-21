/** @type {import('next').NextConfig} */
// Default Next.js settings. "Cache Components" (on in new Next.js 16 starters) is
// left off, so app/layout.js can check the login without extra <Suspense> wrappers.
// `await connection()` in app/layout.js makes every page check the login on each visit.
const nextConfig = {};

export default nextConfig;
