# Supabase + Vercel setup checklist

## 1) Supabase SQL migrations
Run in Supabase SQL Editor, in this order:

1. `supabase/migrations/0001_mvp_init.sql`
2. `supabase/migrations/0002_storage_log_photos.sql`

## 2) Supabase Authentication settings
In Supabase Dashboard -> Authentication -> URL Configuration:

- Site URL (local): `http://127.0.0.1:3001`
- Redirect URLs:
  - `http://127.0.0.1:3001/**`
  - `https://<your-vercel-domain>/**`

Enable Email provider in Authentication -> Providers.

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
