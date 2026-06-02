const IFRAME_SRC_TOKEN_PATTERN = /\[\[iframe:\s*([\s\S]*?)\s*\]\]/gi;
const IFRAME_TITLE_TOKEN_PATTERN = /\[\[iframe-title:\s*([\s\S]*?)\s*\]\]/gi;
const IFRAME_BLOCK_TOKEN_PATTERN =
  /\[\[iframe:\s*([\s\S]*?)\s*\]\]\s*\[\[iframe-title:\s*([\s\S]*?)\s*\]\]/gi;

function escapeHtmlAttribute(value: string | undefined): string {
  return (value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildIframeMarkup(src: string, title: string): string {
  const safeTitle = title.trim() || 'Contenu intégré';

  return [
    '<div class="iframe-container">',
    '<iframe',
    ` src="${escapeHtmlAttribute(src)}"`,
    ` title="${escapeHtmlAttribute(safeTitle)}"`,
    ' frameborder="0"',
    ' loading="lazy"',
    ' allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"',
    ' referrerpolicy="strict-origin-when-cross-origin"',
    ' allowfullscreen',
    '></iframe>',
    '</div>',
  ].join('');
}

export function createIframeToken(src: string, title: string = ''): string {
  return `[[iframe:${src.trim()}]][[iframe-title:${title.trim()}]]`;
}

function replaceIframesWithDomParser(html: string): string {
  const parser = new DOMParser();
  const documentFragment = parser.parseFromString(html, 'text/html');

  documentFragment.body.querySelectorAll('iframe').forEach((iframe) => {
    const src = iframe.getAttribute('src')?.trim() ?? '';

    if (!src) {
      iframe.remove();
      return;
    }

    const title = iframe.getAttribute('title')?.trim() ?? '';
    const token = createIframeToken(src, title);
    iframe.replaceWith(documentFragment.createTextNode(token));
  });

  return documentFragment.body.innerHTML.trim();
}

function extractAttribute(attributes: string, name: string): string {
  const match = attributes.match(
    new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'),
  );

  return (match?.[2] ?? match?.[3] ?? match?.[4] ?? '').trim();
}

function replaceIframesWithFallback(html: string): string {
  return html.replace(/<iframe\b([^>]*)>(?:<\/iframe>)?/gi, (_match, attrs) => {
    const src = extractAttribute(attrs, 'src');

    if (!src) {
      return '';
    }

    const title = extractAttribute(attrs, 'title');
    return createIframeToken(src, title);
  });
}

export function replaceIframesWithTokens(html: string): string {
  if (!html) {
    return html;
  }

  if (typeof DOMParser === 'undefined') {
    return replaceIframesWithFallback(html);
  }

  return replaceIframesWithDomParser(html);
}

export function buildHtmlWithIframes(html: string): string {
  if (!html) {
    return html;
  }

  return html.replace(
    IFRAME_BLOCK_TOKEN_PATTERN,
    (_match, src: string, title: string) =>
      buildIframeMarkup(src.trim(), title),
  );
}

export function extractIframes(
  value: string,
): Array<{ src: string; title: string }> {
  if (!value) {
    return [];
  }

  const srcTokens = Array.from(value.matchAll(IFRAME_SRC_TOKEN_PATTERN));
  const titleTokens = Array.from(value.matchAll(IFRAME_TITLE_TOKEN_PATTERN));

  return srcTokens.map((token, index) => ({
    src: token[1].trim(),
    title: titleTokens[index]?.[1].trim() ?? '',
  }));
}
