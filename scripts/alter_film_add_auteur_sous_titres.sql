-- La table "films" existe déjà : ajouter la colonne optionnelle auteurSousTitres.

alter table public.films add column if not exists "auteurSousTitres" text;
