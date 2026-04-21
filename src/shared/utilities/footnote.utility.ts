const FOOTNOTE_TOKEN_PREFIX = '[[note:';
const FOOTNOTE_TOKEN_SUFFIX = ']]';
const FOOTNOTE_TOKEN_PATTERN = /\[\[note:\s*([\s\S]*?)\s*\]\]/gi;

export interface FootnoteItem {
  index: number;
  content: string;
  token: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatFootnoteContent(value: string): string {
  return escapeHtml(value.trim()).replace(/\r?\n/g, '<br />');
}

export function createFootnoteToken(content: string): string {
  return `${FOOTNOTE_TOKEN_PREFIX} ${content.trim()} ${FOOTNOTE_TOKEN_SUFFIX}`;
}

export function extractFootnotes(value: string): FootnoteItem[] {
  if (!value) {
    return [];
  }

  return Array.from(value.matchAll(FOOTNOTE_TOKEN_PATTERN)).map(
    (match, index) => ({
      index,
      content: match[1].trim(),
      token: match[0],
    }),
  );
}

export function replaceFootnoteAt(
  value: string,
  footnoteIndex: number,
  content: string,
): string {
  const footnote = extractFootnotes(value)[footnoteIndex];

  if (!footnote) {
    return value;
  }

  return value.replace(footnote.token, createFootnoteToken(content));
}

export function removeFootnoteAt(value: string, footnoteIndex: number): string {
  const footnote = extractFootnotes(value)[footnoteIndex];

  if (!footnote) {
    return value;
  }

  return value.replace(footnote.token, '');
}

export function buildHtmlWithFootnotes(html: string): string {
  if (!html) {
    return html;
  }

  const footnotes: string[] = [];

  const contentWithReferences = html.replace(
    FOOTNOTE_TOKEN_PATTERN,
    (_match, noteContent: string) => {
      const sanitizedContent = formatFootnoteContent(noteContent);

      if (!sanitizedContent) {
        return '';
      }

      footnotes.push(sanitizedContent);

      const noteNumber = footnotes.length;

      return [
        '<sup class="footnote-ref">',
        `<a href="#note-${noteNumber}" id="note-ref-${noteNumber}" class="note" aria-describedby="note-${noteNumber}">`,
        `${noteNumber}`,
        '</a>',
        '</sup>',
      ].join('');
    },
  );

  if (!footnotes.length) {
    return html;
  }

  const footnotesMarkup = footnotes
    .map((footnote, index) =>
      [
        `<li class="note" id="note-${index + 1}">`,
        `<span class="note-content">${footnote}</span> `,
        `<a href="#note-ref-${index + 1}" class="footnote-backlink"><span aria-hidden="true">↩</span><span class="sr-only">Retour à la note ${index + 1}</span></a>`,
        '</li>',
      ].join(''),
    )
    .join('');

  return [
    contentWithReferences,
    '<section class="footnotes">',
    '<h3>Notes de bas de page</h3>',
    '<hr />',
    '<ol>',
    footnotesMarkup,
    '</ol>',
    '</section>',
  ].join('');
}
