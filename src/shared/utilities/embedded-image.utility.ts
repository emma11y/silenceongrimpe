const IMG_TAG_PATTERN = /<img\b[^>]*>/gi;
const DATA_SRC_PATTERN = /src="(data:[^;"]+;base64,[^"]*)"/i;
const ALT_PATTERN = /alt="([^"]*)"/i;

export interface EmbeddedImage {
  dataUri: string;
  alt: string;
}

export function extractEmbeddedImages(html: string): EmbeddedImage[] {
  const images = new Map<string, EmbeddedImage>();

  for (const tag of html.match(IMG_TAG_PATTERN) ?? []) {
    const dataUri = tag.match(DATA_SRC_PATTERN)?.[1];

    if (dataUri && !images.has(dataUri)) {
      images.set(dataUri, { dataUri, alt: tag.match(ALT_PATTERN)?.[1] ?? '' });
    }
  }

  return Array.from(images.values());
}

export function replaceEmbeddedImage(
  html: string,
  dataUri: string,
  url: string,
): string {
  return html.split(dataUri).join(url);
}
