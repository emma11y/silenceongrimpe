-- La table "films" existe déjà : ajouter la colonne optionnelle lienVisionnage.

alter table public.films add column if not exists "lienVisionnage" text;
