import { replaceIframesWithTokens } from '@utilities/iframe.utility';
import { buildHtmlWithFootnotes } from '@utilities/footnote.utility';
import { buildHtmlWithIframes } from '@utilities/iframe.utility';
import { buildHtmlWithVideos } from '@utilities/video.utility';

type HtmlTransform = (value: string) => string;

const ACTUALITE_HTML_TRANSFORMS: HtmlTransform[] = [
  buildHtmlWithFootnotes,
  buildHtmlWithVideos,
  buildHtmlWithIframes,
];

const DANGEROUS_TAGS_SELECTOR = [
  'script',
  'object',
  'embed',
  'link',
  'meta',
  'base',
  'noscript',
].join(',');

const URL_ATTRIBUTES = new Set([
  'href',
  'src',
  'xlink:href',
  'action',
  'formaction',
  'poster',
]);

function isUnsafeUrl(value: string): boolean {
  const normalizedValue = value.trim().replace(/\s+/g, '').toLowerCase();

  return (
    normalizedValue.startsWith('javascript:') ||
    normalizedValue.startsWith('vbscript:') ||
    normalizedValue.startsWith('data:text/html')
  );
}

function sanitizeElementAttributes(element: Element): void {
  for (const attribute of Array.from(element.attributes)) {
    const attributeName = attribute.name.toLowerCase();

    if (attributeName.startsWith('on') || attributeName === 'srcdoc') {
      element.removeAttribute(attribute.name);
      continue;
    }

    if (URL_ATTRIBUTES.has(attributeName) && isUnsafeUrl(attribute.value)) {
      element.removeAttribute(attribute.name);
    }
  }
}

function sanitizeWithDomParser(value: string): string {
  const parser = new DOMParser();
  const documentFragment = parser.parseFromString(value, 'text/html');

  documentFragment
    .querySelectorAll(DANGEROUS_TAGS_SELECTOR)
    .forEach((element) => element.remove());

  documentFragment.body
    .querySelectorAll('*')
    .forEach((element) => sanitizeElementAttributes(element));

  return documentFragment.body.innerHTML.trim();
}

function sanitizeWithFallback(value: string): string {
  return value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(
      /\s(?:href|src|xlink:href|action|formaction|poster)\s*=\s*("|')\s*(?:javascript:|vbscript:|data:text\/html)[\s\S]*?\1/gi,
      '',
    );
}

export function sanitizeHtmlFragment(value: string): string {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return '';
  }

  if (typeof DOMParser === 'undefined') {
    return sanitizeWithFallback(trimmedValue).trim();
  }

  return sanitizeWithDomParser(trimmedValue);
}

export function prepareHtmlForEditor(value: string): string {
  return replaceIframesWithTokens(sanitizeHtmlFragment(value));
}

export function buildHtmlForActualite(value: string): string {
  return ACTUALITE_HTML_TRANSFORMS.reduce(
    (currentValue, transform) => transform(currentValue),
    value,
  );
}
