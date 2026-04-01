-- Farms table (one per save file / playthrough)
create table public.farms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  farmer_name text not null,
  farm_type text default 'Standard',
  current_season text default 'Spring',
  current_year int default 1,
  current_day int default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Daily logs table
create table public.daily_logs (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid references public.farms(id) on delete cascade not null,
  season text not null,
  day int not null check (day >= 1 and day <= 28),
  year int not null check (year >= 1),
  gold_earned int default 0,
  gold_spent int default 0,
  energy_used int default 0,
  weather text default 'Sunny',
  notes text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(farm_id, season, day, year)
);

-- Activities within a daily log
create table public.activities (
  id uuid primary key default gen_random_uuid(),
  log_id uuid references public.daily_logs(id) on delete cascade not null,
  category text not null, -- farming, mining, fishing, foraging, social, combat, other
  description text not null,
  completed boolean default false,
  created_at timestamptz default now()
);

-- Gift tracker
create table public.gifts (
  id uuid primary key default gen_random_uuid(),
  log_id uuid references public.daily_logs(id) on delete cascade not null,
  villager text not null,
  item text not null,
  reaction text default 'neutral', -- love, like, neutral, dislike, hate
  created_at timestamptz default now()
);

-- Crop tracker
create table public.crops (
  id uuid primary key default gen_random_uuid(),
  log_id uuid references public.daily_logs(id) on delete cascade not null,
  crop_name text not null,
  quantity int default 1,
  action text not null, -- planted, harvested, watered, died
  created_at timestamptz default now()
);

-- RLS policies
alter table public.farms enable row level security;
alter table public.daily_logs enable row level security;
alter table public.activities enable row level security;
alter table public.gifts enable row level security;
alter table public.crops enable row level security;

-- Farms: users can only access their own
create policy "Users can view own farms" on public.farms for select using (auth.uid() = user_id);
create policy "Users can insert own farms" on public.farms for insert with check (auth.uid() = user_id);
create policy "Users can update own farms" on public.farms for update using (auth.uid() = user_id);
create policy "Users can delete own farms" on public.farms for delete using (auth.uid() = user_id);

-- Daily logs: users can access logs for their farms
create policy "Users can view own logs" on public.daily_logs for select using (
  farm_id in (select id from public.farms where user_id = auth.uid())
);
create policy "Users can insert own logs" on public.daily_logs for insert with check (
  farm_id in (select id from public.farms where user_id = auth.uid())
);
create policy "Users can update own logs" on public.daily_logs for update using (
  farm_id in (select id from public.farms where user_id = auth.uid())
);
create policy "Users can delete own logs" on public.daily_logs for delete using (
  farm_id in (select id from public.farms where user_id = auth.uid())
);

-- Activities: users can access activities for their logs
create policy "Users can view own activities" on public.activities for select using (
  log_id in (select dl.id from public.daily_logs dl join public.farms f on dl.farm_id = f.id where f.user_id = auth.uid())
);
create policy "Users can insert own activities" on public.activities for insert with check (
  log_id in (select dl.id from public.daily_logs dl join public.farms f on dl.farm_id = f.id where f.user_id = auth.uid())
);
create policy "Users can update own activities" on public.activities for update using (
  log_id in (select dl.id from public.daily_logs dl join public.farms f on dl.farm_id = f.id where f.user_id = auth.uid())
);
create policy "Users can delete own activities" on public.activities for delete using (
  log_id in (select dl.id from public.daily_logs dl join public.farms f on dl.farm_id = f.id where f.user_id = auth.uid())
);

-- Gifts: same pattern
create policy "Users can view own gifts" on public.gifts for select using (
  log_id in (select dl.id from public.daily_logs dl join public.farms f on dl.farm_id = f.id where f.user_id = auth.uid())
);
create policy "Users can insert own gifts" on public.gifts for insert with check (
  log_id in (select dl.id from public.daily_logs dl join public.farms f on dl.farm_id = f.id where f.user_id = auth.uid())
);
create policy "Users can update own gifts" on public.gifts for update using (
  log_id in (select dl.id from public.daily_logs dl join public.farms f on dl.farm_id = f.id where f.user_id = auth.uid())
);
create policy "Users can delete own gifts" on public.gifts for delete using (
  log_id in (select dl.id from public.daily_logs dl join public.farms f on dl.farm_id = f.id where f.user_id = auth.uid())
);

-- Crops: same pattern
create policy "Users can view own crops" on public.crops for select using (
  log_id in (select dl.id from public.daily_logs dl join public.farms f on dl.farm_id = f.id where f.user_id = auth.uid())
);
create policy "Users can insert own crops" on public.crops for insert with check (
  log_id in (select dl.id from public.daily_logs dl join public.farms f on dl.farm_id = f.id where f.user_id = auth.uid())
);
create policy "Users can update own crops" on public.crops for update using (
  log_id in (select dl.id from public.daily_logs dl join public.farms f on dl.farm_id = f.id where f.user_id = auth.uid())
);
create policy "Users can delete own crops" on public.crops for delete using (
  log_id in (select dl.id from public.daily_logs dl join public.farms f on dl.farm_id = f.id where f.user_id = auth.uid())
);
