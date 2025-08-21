export function convertToSlug(title: string) {
  // Convertir le titre en minuscules
  let slug = title.toLowerCase();

  // Remplacer les caractères accentués par leurs équivalents non accentués
  slug = slug
    .replace(/[àáâäãå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôöõ]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[ñ]/g, 'n');

  // Remplacer les espaces et les caractères spéciaux par des tirets
  slug = slug.replace(/[^a-z0-9]+/g, '-');

  // Supprimer les tirets en début et en fin de chaîne
  slug = slug.replace(/^-+|-+$/g, '');

  return slug;
}
