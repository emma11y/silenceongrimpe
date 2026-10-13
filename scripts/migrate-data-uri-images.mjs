// Migre les images data: (base64) du html des actualités vers la table `images`
// et remplace chaque src par l'URL de la fonction get-image.
//
// Usage :
//   node scripts/migrate-data-uri-images.mjs            # dry-run (lecture seule)
//   node scripts/migrate-data-uri-images.mjs --apply    # écrit en base
//
// Si la clé anon est refusée en écriture (RLS), fournir un jeton de session admin :
//   SUPABASE_ACCESS_TOKEN=<jwt> node scripts/migrate-data-uri-images.mjs --apply
//
// Le html d'origine est sauvegardé dans scripts/backup/ avant toute mise à jour.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const apply = process.argv.includes('--apply');

const env = readFileSync(
  new URL('../src/environments/environment.ts', import.meta.url),
  'utf8',
);
const baseUrl = env.match(/supabaseUrl:\s*'([^']+)'/)[1];
const key = env.match(/supabaseKey:\s*'([^']+)'/)[1];
const token = process.env.SUPABASE_ACCESS_TOKEN ?? key;

const headers = {
  apikey: key,
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
};

const IMG_TAG = /<img\b[^>]*>/gi;
const DATA_SRC = /src="(data:[^;"]+;base64,[^"]*)"/i;
const ALT = /alt="([^"]*)"/i;

async function api(path, options = {}) {
  const res = await fetch(`${baseUrl}/rest/v1/${path}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    throw new Error(`${options.method ?? 'GET'} ${path} -> ${res.status} ${await res.text()}`);
  }
  return res.json();
}

const actualites = await api('actualites?select=id,slug,html');

for (const actualite of actualites) {
  const html = actualite.html ?? '';
  const images = (html.match(IMG_TAG) ?? [])
    .map((tag) => ({
      dataUri: tag.match(DATA_SRC)?.[1],
      alt: tag.match(ALT)?.[1] ?? '',
    }))
    .filter((image) => image.dataUri);

  if (!images.length) {
    continue;
  }

  console.log(
    `${actualite.slug}: ${images.length} image(s), html ${(html.length / 1024).toFixed(0)} Ko`,
  );

  if (!apply) {
    continue;
  }

  mkdirSync(new URL('./backup/', import.meta.url), { recursive: true });
  writeFileSync(
    new URL(`./backup/${actualite.slug}.html`, import.meta.url),
    html,
  );

  let newHtml = html;

  // Toutes les insertions d'abord : si l'une échoue, l'actualité reste intacte.
  for (const [index, image] of images.entries()) {
    const [created] = await api('images', {
      method: 'POST',
      body: JSON.stringify({
        image: image.dataUri,
        alt: image.alt,
        name: `${actualite.slug}-${index + 1}`,
        credit: '',
      }),
    });
    newHtml = newHtml
      .split(image.dataUri)
      .join(`${baseUrl}/functions/v1/get-image?guid=${created.id}`);
    console.log(`  image ${index + 1} -> ${created.id}`);
  }

  const updated = await api(`actualites?id=eq.${actualite.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ html: newHtml }),
  });

  if (!updated.length) {
    throw new Error(
      `Mise à jour de ${actualite.slug} refusée (RLS ?). Les images ont été créées ; relancer avec SUPABASE_ACCESS_TOKEN.`,
    );
  }

  console.log(`  html ${(html.length / 1024).toFixed(0)} Ko -> ${(newHtml.length / 1024).toFixed(0)} Ko`);
}

if (!apply) {
  console.log('\nDry-run : rien écrit. Ajouter --apply pour migrer.');
}
