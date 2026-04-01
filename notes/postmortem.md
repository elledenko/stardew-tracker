# Stardew Tracker — Living Postmortem

## Phase 0: PREFLIGHT — 2026-04-01T14:53:08Z
**What happened:** All tools authenticated. Hit Supabase free project limit on primary org, used fiire org instead.
**What worked:** CLI provisioning for Supabase worked smoothly once correct org was selected.
**What didn't:** Had to try two orgs due to free tier limit.
**Adjustment:** Check project limits before attempting creation.

## Phase 1-3: INTAKE/RESEARCH/DEFINE — 2026-04-01T14:53:30Z
**What happened:** Auto mode — inferred product from idea description. Stardew Valley daily tracker with crops, gifts, activities, gold tracking. Research confirmed large community (35M+ copies, 2M+ subreddit) with zero daily companion tools.
**What worked:** Clear gap in market. Existing tools are all references/calculators, no journaling.
**What didn't:** N/A (auto mode, no user interaction).
**Adjustment:** None needed.

## Phase 4-7: ROADMAP/FOUNDATION/SETUP/PLAN — 2026-04-01T14:55:00Z
**What happened:** Scaffolded Next.js app, set up Supabase with full schema (farms, daily_logs, activities, gifts, crops), configured RLS policies, created GitHub repo, linked Vercel.
**What worked:** Database schema design with RLS was clean. Used gen_random_uuid() instead of uuid_generate_v4() (Supabase compatibility).
**What didn't:** Initial migration used uuid_generate_v4() which doesn't exist in Supabase Postgres. Fixed with gen_random_uuid(). Also middleware.ts was deprecated in Next.js 16 — converted to proxy.ts.
**Adjustment:** Always use gen_random_uuid() for Supabase. Check Next.js version docs for API changes.

## BUILD Phase 1: Full App — 2026-04-01T14:58:00Z
**What happened:** Built complete app in single phase: auth, multi-farm dashboard, season calendar, daily log editor with activities/gifts/crops tracking.
**What worked:** Clean dark theme UI. Calendar view with 28-day grid per season. Real-time add/delete for activities, gifts, crops.
**What didn't:** Type error on Weather state type — needed explicit string type annotation.
**Adjustment:** Use explicit type annotations when state values come from database (string) but TypeScript infers union types.
