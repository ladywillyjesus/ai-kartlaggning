-- Tabell för förfrågningar från AI-kartläggning.
-- Kör i Supabase: SQL Editor → New query → klistra in → Run.

create table if not exists public.forfragningar (
  id          bigint generated always as identity primary key,
  skapad      timestamptz not null default now(),
  bransch     text        not null,
  uppgift     text        not null,
  timmar      numeric     not null,
  typ         text        not null,          -- forslag | mer_information | ej_lamplig
  forslag     jsonb       not null,          -- hela svaret från Claude
  namn        text,                          -- bara om besökaren själv anger det
  epost       text                           -- bara om besökaren själv anger det
);

comment on table public.forfragningar is
  'Förfrågningar från kartlaggning.indefinitai.com. Namn och e-post sparas bara om besökaren anger dem.';

-- Radnivåsäkerhet påslagen och inga policyer: webbläsaren (publishable/anon-nyckeln)
-- kan varken läsa eller skriva. Bara serverfunktionen med den hemliga nyckeln kommer åt tabellen.
alter table public.forfragningar enable row level security;
