-- films.vignetteId : clé étrangère vers vignettes (vignetteUrl est conservé pour les liens externes).
-- on delete set null : supprimer une vignette ne supprime jamais le film.

alter table public.films
  add column if not exists "vignetteId" uuid
  references public.vignettes (id) on delete set null;

-- vignetteUrl devient facultatif quand une vignette est stockée en base.
alter table public.films alter column "vignetteUrl" drop not null;

create index if not exists films_vignette_id_idx on public.films ("vignetteId");
