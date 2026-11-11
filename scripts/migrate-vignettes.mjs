// Migration one-shot : télécharge les vignettes externes des films, les stocke en base64
// dans la table "vignettes" et remplace films.vignetteUrl par le lien de l'edge function.
// Les images de plus de 1 Mo sont réencodées en webp et redimensionnées (sharp).
//
// Usage (bash) :
//   node --env-file=.env scripts/migrate-vignettes.mjs --dry-run
//   node --env-file=.env scripts/migrate-vignettes.mjs
// (.env : SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY)
//
// Sauvegarde des anciens liens : scripts/backup/vignettes-backup-<date>.json (ignoré par git).
// Ne jamais commiter la clé service role.

import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';

const MAX_SIZE_BYTES = 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const SHRINK_WIDTHS = [1600, 1200, 900, 600];
const DROPBOX_HOSTS =['www.dropbox.com', 'dropbox.com'];

const dryRun = process.argv.includes('--dry-run');
const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '');
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requis.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);
const vignetteUrlPrefix = `${supabaseUrl}/functions/v1/get-film-vignette?id=`;

function toDirectUrl(url) {
  const parsed = new URL(url);

  if (DROPBOX_HOSTS.includes(parsed.hostname)) {
    parsed.searchParams.delete('dl');
    parsed.searchParams.set('raw', '1');
  }

  return parsed.toString();
}

async function downloadAsDataUri(url) {
  const response = await fetch(toDirectUrl(url), { redirect: 'follow' });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const contentType = response.headers.get('content-type')?.split(';')[0].trim();

  if (!contentType || !ACCEPTED_TYPES.includes(contentType)) {
    throw new Error(`format non supporté (${contentType ?? 'inconnu'})`);
  }

  let bytes = Buffer.from(await response.arrayBuffer());
  let type = contentType;

  if (bytes.length > MAX_SIZE_BYTES) {
    const originalKo = Math.round(bytes.length / 1024);
    bytes = await shrink(bytes);
    type = 'image/webp';
    console.log(`  réduite : ${originalKo} Ko -> ${Math.round(bytes.length / 1024)} Ko`);
  }

  return `data:${type};base64,${bytes.toString('base64')}`;
}

// Réencode en webp en réduisant la largeur jusqu'à passer sous la limite.
async function shrink(bytes) {
  for (const width of SHRINK_WIDTHS) {
    const result = await sharp(bytes)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    if (result.length <= MAX_SIZE_BYTES) {
      return result;
    }
  }

  throw new Error('image impossible à réduire sous 1 Mo');
}

const { data: films, error } = await supabase
  .from('films')
  .select('id, titre, vignetteUrl')
  .order('id');

if (error) {
  console.error('Lecture des films impossible :', error.message);
  process.exit(1);
}

const backup = [];
const failures = [];
let migrated = 0;
let skipped = 0;

for (const film of films) {
  if (!film.vignetteUrl || film.vignetteUrl.startsWith(vignetteUrlPrefix)) {
    skipped++;
    continue;
  }

  try {
    const image = await downloadAsDataUri(film.vignetteUrl);
    const id = randomUUID();

    if (dryRun) {
      console.log(`[dry-run] #${film.id} ${film.titre} : OK (${image.length} car.)`);
      migrated++;
      continue;
    }

    const insert = await supabase.from('vignettes').insert({ id, image });

    if (insert.error) {
      throw new Error(`insertion : ${insert.error.message}`);
    }

    const newUrl = `${vignetteUrlPrefix}${id}`;
    const update = await supabase
      .from('films')
      .update({ vignetteUrl: newUrl })
      .eq('id', film.id);

    if (update.error) {
      await supabase.from('vignettes').delete().eq('id', id);
      throw new Error(`mise à jour du film : ${update.error.message}`);
    }

    backup.push({ filmId: film.id, vignetteId: id, ancienLien: film.vignetteUrl });
    console.log(`#${film.id} ${film.titre} : migré`);
    migrated++;
  } catch (e) {
    failures.push({ filmId: film.id, titre: film.titre, lien: film.vignetteUrl, raison: e.message });
    console.warn(`#${film.id} ${film.titre} : ÉCHEC - ${e.message}`);
  }
}

if (backup.length) {
  mkdirSync('scripts/backup', { recursive: true });
  const file = `scripts/backup/vignettes-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  writeFileSync(file, JSON.stringify(backup, null, 2));
  console.log(`Sauvegarde des anciens liens : ${file}`);
}

console.log(
  `\n${dryRun ? '[dry-run] ' : ''}Migrés : ${migrated} | ignorés : ${skipped} | échecs : ${failures.length}`,
);

if (failures.length) {
  console.log('Films non migrés (ancien lien conservé) :');
  console.table(failures);
}
