# Stardew Tracker — Product Overview

## Problem
Stardew Valley players have no good way to track their daily in-game progress. Existing tools are static references (wikis, calculators) — none let you log what you did each in-game day or see your farm's evolution over time.

## Target User
Stardew Valley players who want to track their playthrough — casual farmers who want a journal, completionists tracking gifts and crops, and min-maxers optimizing gold per day.

## Core Value Proposition
A daily companion app for Stardew Valley that lets you log activities, gifts, crops, and gold for each in-game day, organized by season and year.

## V0.1 Feature Set

### In
- User accounts (email/password)
- Multiple farm/save file support
- Season calendar view (Spring/Summer/Fall/Winter, 28 days each)
- Daily log entries with: weather, gold earned/spent, energy, notes
- Activity tracker (farming, mining, fishing, foraging, social, combat)
- Gift tracker (villager, item, reaction)
- Crop tracker (crop name, quantity, action)
- Current day/season/year tracking per farm

### Out (future)
- Save file import
- Multiplayer/co-op features
- Bundle completion tracking
- Relationship heart level tracking
- Mining progress tracker
- Recipe/crafting completion
- Mobile native app

## Tech Stack
- Next.js (App Router) + Tailwind CSS
- Supabase (Auth, PostgreSQL)
- Vercel (deployment)
- TypeScript

## Success Metric
A user can create a farm, navigate to a specific in-game day, and log their activities, gifts, and crops — then see which days have been logged on the season calendar.
