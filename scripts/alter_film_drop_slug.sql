-- La table "films" a déjà été créée avec la colonne slug : la supprimer.

alter table public.films drop column if exists slug;
