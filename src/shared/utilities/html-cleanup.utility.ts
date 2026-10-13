// Déclarations CSS sans effet visuel, laissées par les copier-coller depuis
// Google Docs (texte noir sur fond transparent).
const INERT_DECLARATIONS = new Set([
  'color: rgb(0, 0, 0)',
  'background-color: transparent',
]);

function parseBody(html: string): HTMLElement {
  return new DOMParser().parseFromString(html, 'text/html').body;
}

function isInertSpan(element: Element): boolean {
  if (element.attributes.length !== 1 || !element.hasAttribute('style')) {
    return false;
  }

  const declarations = (element.getAttribute('style') ?? '')
    .split(';')
    .map((declaration) => declaration.trim().replace(/\s+/g, ' '))
    .filter(Boolean);

  return (
    declarations.length > 0 &&
    declarations.every((declaration) => INERT_DECLARATIONS.has(declaration))
  );
}

function findInertSpans(body: HTMLElement): Element[] {
  return Array.from(body.querySelectorAll('span')).filter(isInertSpan);
}

export function countInertSpans(html: string): number {
  return html ? findInertSpans(parseBody(html)).length : 0;
}

export function removeInertSpans(html: string): string {
  const body = parseBody(html);

  findInertSpans(body).forEach((span) =>
    span.replaceWith(...Array.from(span.childNodes)),
  );

  return body.innerHTML;
}
