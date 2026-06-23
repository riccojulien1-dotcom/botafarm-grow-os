# Supabase + Vercel setup checklist

## 1) Supabase SQL migrations
Run in Supabase SQL Editor, in this order:

1. `supabase/migrations/0001_mvp_init.sql`
2. `supabase/migrations/0002_storage_log_photos.sql`

## 2) Supabase Authentication settings
In Supabase Dashboard -> Authentication -> URL Configuration:

- Site URL (production): `https://botafarm-grow-os.vercel.app`
- Site URL (local): `http://127.0.0.1:3001`
- Redirect URLs:
  - `http://127.0.0.1:3001/**`
  - `https://botafarm-grow-os.vercel.app/**`

Enable Email provider in Authentication -> Providers.

### Beta (required for open tester signup)
In Supabase Dashboard -> Authentication -> Providers -> Email:

- **Disable "Confirm email"** so new users get an immediate session (no confirmation email sent on signup).
- Supabase default email delivery is limited to a small hourly/daily quota. With confirmation enabled, every signup sends mail and quickly hits `email rate limit exceeded`, blocking 100% of new registrations.

Re-enable email confirmation before public launch, ideally with custom SMTP (Resend, SendGrid, etc.).

## 3) Environment variables
Set these in local `.env.local` and in Vercel Project -> Settings -> Environment Variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 4) Vercel deployment
1. In Vercel, import the GitHub repository: `riccojulien1-dotcom/botafarm-grow-os`.
2. Framework preset: Next.js (auto detected).
3. Add the three environment variables above.
4. Deploy.

## 5) Post-deploy smoke test
- Visit `/signup`, create account.
- Confirm redirect to `/dashboard`.
- Create a grow room.
- Add a daily log entry.
