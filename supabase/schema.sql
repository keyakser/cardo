-- KurdiCards database. Paste this whole file into Supabase → SQL Editor → Run.
-- Safe to run more than once.

-- ---------- Tables ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '',
  email text not null default '',
  created_at timestamptz not null default now()
);
alter table public.profiles add column if not exists email text not null default '';

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  ku text not null,
  pos text not null default '',
  meaning text not null,
  example_ku text not null default '',
  example_tr text not null default '',
  note text not null default '',
  lang text not null default 'en',
  created_at timestamptz not null default now(),
  unique (user_id, ku, meaning)
);
create index if not exists favorites_user_idx on public.favorites (user_id, created_at desc);

-- One row per "Make flashcards" request (anonymous ones have no user).
create table if not exists public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid default auth.uid() references auth.users (id) on delete set null,
  mode text not null,
  lang text not null default 'en',
  level text not null default 'beginner',
  ui_lang text not null default 'en',
  card_count int not null default 0,
  duration_ms int not null default 0,
  success boolean not null default true,
  title text not null default '',
  deck jsonb,
  created_at timestamptz not null default now()
);
create index if not exists generations_user_idx on public.generations (user_id, created_at desc);
create index if not exists generations_time_idx on public.generations (created_at desc);

-- Admins. No policies allow writing here, so only the SQL editor can add people.
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

-- ---------- Helpers ----------
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ---------- Row level security ----------
alter table public.profiles enable row level security;
alter table public.favorites enable row level security;
alter table public.generations enable row level security;
alter table public.admins enable row level security;

drop policy if exists "own profile read" on public.profiles;
drop policy if exists "own profile update" on public.profiles;
create policy "own profile read" on public.profiles for select using (auth.uid() = id or public.is_admin());
create policy "own profile update" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "own favorites" on public.favorites;
create policy "own favorites" on public.favorites for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "log generation" on public.generations;
drop policy if exists "read own generations" on public.generations;
drop policy if exists "delete own generations" on public.generations;
create policy "log generation" on public.generations for insert
  with check (user_id is null or user_id = auth.uid());
create policy "read own generations" on public.generations for select
  using (auth.uid() = user_id or public.is_admin());
create policy "delete own generations" on public.generations for delete using (auth.uid() = user_id);

drop policy if exists "admins read self" on public.admins;
create policy "admins read self" on public.admins for select using (user_id = auth.uid());

-- ---------- Sign-up trigger ----------
-- Creates the profile row; the Kurdolingo address below becomes an admin automatically.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name, email)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', ''), coalesce(new.email, ''))
  on conflict (id) do nothing;
  if lower(new.email) in ('info@kurdolingo.com') then
    insert into public.admins (user_id) values (new.id) on conflict do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill anyone who signed up before this ran.
insert into public.profiles (id, display_name, email)
select id, coalesce(raw_user_meta_data ->> 'display_name', ''), coalesce(email, '') from auth.users
on conflict (id) do update set email = excluded.email;
insert into public.admins (user_id)
select id from auth.users where lower(email) in ('info@kurdolingo.com')
on conflict do nothing;

-- ---------- Stats ----------
create or replace function public.my_stats()
returns json language sql stable security definer set search_path = '' as $$
  select json_build_object(
    'decks', (select count(*) from public.generations where user_id = auth.uid() and success),
    'cards', (select coalesce(sum(card_count), 0) from public.generations where user_id = auth.uid() and success),
    'favorites', (select count(*) from public.favorites where user_id = auth.uid())
  );
$$;

create or replace function public.admin_stats()
returns json language plpgsql stable security definer set search_path = '' as $$
declare result json;
begin
  if not public.is_admin() then
    raise exception 'not allowed';
  end if;
  select json_build_object(
    'users', (select count(*) from public.profiles),
    'users_7d', (select count(*) from public.profiles where created_at > now() - interval '7 days'),
    'generations', (select count(*) from public.generations),
    'generations_24h', (select count(*) from public.generations where created_at > now() - interval '24 hours'),
    'cards', (select coalesce(sum(card_count), 0) from public.generations where success),
    'success_rate', (select coalesce(round(100.0 * avg(case when success then 1 else 0 end)), 0) from public.generations),
    'avg_ms', (select coalesce(round(avg(duration_ms)), 0) from public.generations where success),
    'anon_share', (select coalesce(round(100.0 * avg(case when user_id is null then 1 else 0 end)), 0) from public.generations),
    'favorites', (select count(*) from public.favorites),
    'daily', (
      select coalesce(json_agg(json_build_object('day', d::date, 'n', coalesce(g.n, 0)) order by d), '[]')
      from generate_series(current_date - 13, current_date, interval '1 day') d
      left join (
        select created_at::date as day, count(*) as n from public.generations
        where created_at > current_date - 14 group by 1
      ) g on g.day = d::date
    ),
    'by_mode', (select coalesce(json_object_agg(mode, n), '{}') from (select mode, count(*) n from public.generations group by mode) x),
    'by_lang', (select coalesce(json_object_agg(lang, n), '{}') from (select lang, count(*) n from public.generations group by lang) x),
    'by_ui', (select coalesce(json_object_agg(ui_lang, n), '{}') from (select ui_lang, count(*) n from public.generations group by ui_lang) x),
    'recent', (
      select coalesce(json_agg(r), '[]') from (
        select g.created_at, g.mode, g.lang, g.card_count, g.duration_ms, g.success, g.title, p.display_name, p.email
        from public.generations g left join public.profiles p on p.id = g.user_id
        order by g.created_at desc limit 20
      ) r
    ),
    'user_list', (
      select coalesce(json_agg(u order by u.created_at desc), '[]') from (
        select p.id, p.display_name, p.email, p.created_at,
          (select count(*) from public.generations g where g.user_id = p.id) as generations,
          (select coalesce(sum(card_count), 0) from public.generations g where g.user_id = p.id and g.success) as cards,
          (select count(*) from public.favorites f where f.user_id = p.id) as favorites,
          (select max(created_at) from public.generations g where g.user_id = p.id) as last_active,
          exists (select 1 from public.admins a where a.user_id = p.id) as is_admin
        from public.profiles p
      ) u
    )
  ) into result;
  return result;
end;
$$;

grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.my_stats() to authenticated;
grant execute on function public.admin_stats() to authenticated;

-- ---------- Reported mistakes ----------
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid default auth.uid() references auth.users (id) on delete set null,
  ku text not null,
  meaning text not null default '',
  example_ku text not null default '',
  example_tr text not null default '',
  lang text not null default 'en',
  reason text not null,
  note text not null default '',
  page text not null default '',
  status text not null default 'open',
  created_at timestamptz not null default now()
);
create index if not exists reports_status_idx on public.reports (status, created_at desc);
alter table public.reports enable row level security;
drop policy if exists "anyone can report" on public.reports;
drop policy if exists "admins read reports" on public.reports;
drop policy if exists "admins update reports" on public.reports;
create policy "anyone can report" on public.reports for insert
  with check ((user_id is null or user_id = auth.uid()) and length(ku) <= 200 and length(note) <= 1000 and reason in ('word','meaning','example','other'));
create policy "admins read reports" on public.reports for select using (public.is_admin());
create policy "admins update reports" on public.reports for update using (public.is_admin()) with check (public.is_admin());

-- Make the new tables visible to the API right away.
notify pgrst, 'reload schema';
