# Botafarm Grow OS - MVP V1 Starter

This repository contains the first implementation baseline for Botafarm Grow OS MVP V1:

- Next.js 16 + App Router + TypeScript + Tailwind
- Supabase integration (browser/server/admin clients)
- Authentication (signup/login/logout)
- Route protection with `proxy.ts`
- Initial Supabase SQL schema with RLS policies
- MVP folders/pages for dashboard, grow rooms, and daily journal

## 1) Project setup

```bash
npm install
cp .env.example .env.local
```

Fill `.env.local` with your Supabase project values.

## 2) Database setup

In Supabase SQL Editor, run:

- `supabase/migrations/0001_mvp_init.sql`

## 3) Auth provider setup

In Supabase Auth settings:

- Enable Email auth provider
- Configure your site URL for local dev (usually `http://localhost:3000`)

## 4) Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## 5) Current MVP pages

- `/login`
- `/signup`
- `/dashboard`
- `/dashboard/grow-rooms`
- `/dashboard/journal`

## 6) Next implementation milestones

- photo upload to Supabase Storage
- reminders CRUD UI
- richer dashboard widgets and trend cards
- AI recommendation service hooks
