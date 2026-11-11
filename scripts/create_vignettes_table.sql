-- Table "vignettes" : vignettes proposées via le formulaire public.
-- Insertion anonyme uniquement (pas de lecture directe) ; lecture via l'edge function "get-film-vignette" (service role).

create table if not exists public.vignettes (
  id uuid primary key,
  image text not null,
  created_at timestamptz not null default now()
);

alter table public.vignettes enable row level security;

-- 1 Mo en base64 ≈ 1 398 102 caractères + préfixe data URI
create policy "Vignettes créables par tous"
  on public.vignettes
  for insert
  to anon, authenticated
  with check (
    image ~ '^data:image/(jpeg|png|webp);base64,'
    and length(image) <= 1450000
  );

-- Nécessaire au delete : Postgres exige une policy select pour un delete filtré par colonne (.eq('id', ...)).
create policy "Vignettes visibles par les utilisateurs authentifiés"
  on public.vignettes
  for select
  to authenticated
  using (true);

create policy "Vignettes supprimables par les utilisateurs authentifiés"
  on public.vignettes
  for delete
  to authenticated
  using (true);
