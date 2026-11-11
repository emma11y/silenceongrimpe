// Sert l'image d'une vignette de film : GET /functions/v1/get-film-vignette?id=<uuid>
// Déploiement : supabase functions deploy get-film-vignette --no-verify-jwt
import { createClient } from 'jsr:@supabase/supabase-js@2';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DATA_URI_REGEX = /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/s;

Deno.serve(async (req) => {
  const id = new URL(req.url).searchParams.get('id');

  if (!id || !UUID_REGEX.test(id)) {
    return new Response('Identifiant invalide', { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { data } = await supabase
    .from('vignettes')
    .select('image')
    .eq('id', id)
    .maybeSingle();

  const match = data?.image?.match(DATA_URI_REGEX);

  if (!match) {
    return new Response('Introuvable', { status: 404 });
  }

  const bytes = Uint8Array.from(atob(match[2]), (c) => c.charCodeAt(0));

  return new Response(bytes, {
    headers: {
      'Content-Type': match[1],
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
});
