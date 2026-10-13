export type LintSeverity = 'error' | 'warning';

export interface LintIssue {
  severity: LintSeverity;
  message: string;
  line: number;
}

const VOID_ELEMENTS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'source',
  'track',
  'wbr',
]);

// Balises dont la fermeture peut être omise en HTML.
const OPTIONAL_CLOSE = new Set(['p', 'li', 'dt', 'dd', 'tr', 'td', 'th']);

const BLOCK_ELEMENTS = new Set([
  'address',
  'blockquote',
  'div',
  'dl',
  'dt',
  'dd',
  'figure',
  'figcaption',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'iframe',
  'li',
  'ol',
  'p',
  'pre',
  'section',
  'table',
  'tbody',
  'thead',
  'tr',
  'td',
  'th',
  'ul',
]);

const RAW_ELEMENTS = new Set(['pre', 'textarea']);

const TAG_PATTERN =
  /<(\/?)([a-zA-Z][\w-]*)((?:"[^"]*"|'[^']*'|[^'">])*?)(\/?)>/g;

function lineOf(source: string, index: number): number {
  let line = 1;

  for (let i = 0; i < index; i++) {
    if (source.charCodeAt(i) === 10) {
      line++;
    }
  }

  return line;
}

function hasAttribute(attributes: string, name: string): boolean {
  return new RegExp(`(^|\\s)${name}(\\s*=|\\s|$)`, 'i').test(attributes);
}

function attributeValue(attributes: string, name: string): string | null {
  const match = new RegExp(
    `(?:^|\\s)${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`,
    'i',
  ).exec(attributes);

  return match ? (match[1] ?? match[2] ?? match[3] ?? '') : null;
}

/** Analyse le HTML source et retourne les problèmes détectés. */
export function lintHtml(source: string): LintIssue[] {
  const issues: LintIssue[] = [];
  const stack: { tag: string; line: number }[] = [];
  const ids = new Map<string, number>();
  let lastHeading = 0;
  let match: RegExpExecArray | null;

  const cleaned = source.replace(/<!--[\s\S]*?-->/g, (comment) =>
    comment.replace(/[^\n]/g, ' '),
  );

  TAG_PATTERN.lastIndex = 0;

  while ((match = TAG_PATTERN.exec(cleaned)) !== null) {
    const [, closing, rawTag, attributes, selfClosing] = match;
    const tag = rawTag.toLowerCase();
    const line = lineOf(cleaned, match.index);

    if (closing) {
      const index = stack.map((entry) => entry.tag).lastIndexOf(tag);

      if (index === -1) {
        issues.push({
          severity: 'error',
          message: `Balise fermante </${tag}> sans balise ouvrante.`,
          line,
        });
        continue;
      }

      for (const unclosed of stack.splice(index + 1).reverse()) {
        if (!OPTIONAL_CLOSE.has(unclosed.tag)) {
          issues.push({
            severity: 'error',
            message: `Balise <${unclosed.tag}> (ligne ${unclosed.line}) non fermée avant </${tag}>.`,
            line: unclosed.line,
          });
        }
      }

      stack.pop();
      continue;
    }

    if (!VOID_ELEMENTS.has(tag) && !selfClosing) {
      stack.push({ tag, line });
    }

    const id = attributeValue(attributes, 'id');

    if (id) {
      if (ids.has(id)) {
        issues.push({
          severity: 'error',
          message: `Identifiant "${id}" en double (déjà ligne ${ids.get(id)}).`,
          line,
        });
      } else {
        ids.set(id, line);
      }
    }

    if (tag === 'img') {
      if (!hasAttribute(attributes, 'alt')) {
        issues.push({
          severity: 'warning',
          message: 'Image sans attribut alt.',
          line,
        });
      }

      if (!attributeValue(attributes, 'src')) {
        issues.push({
          severity: 'error',
          message: 'Image sans attribut src.',
          line,
        });
      }
    }

    if (tag === 'a') {
      const href = attributeValue(attributes, 'href');

      if (!href || href === '#') {
        issues.push({
          severity: 'warning',
          message: 'Lien sans destination (href manquant ou "#").',
          line,
        });
      }

      if (
        attributeValue(attributes, 'target') === '_blank' &&
        !/noopener/i.test(attributeValue(attributes, 'rel') ?? '')
      ) {
        issues.push({
          severity: 'warning',
          message: 'Lien target="_blank" sans rel="noopener".',
          line,
        });
      }
    }

    if (tag === 'h1') {
      issues.push({
        severity: 'warning',
        message: 'Titre <h1> : la page en possède déjà un.',
        line,
      });
    }

    const heading = /^h([1-6])$/.exec(tag);

    if (heading) {
      const level = Number(heading[1]);

      if (lastHeading && level > lastHeading + 1) {
        issues.push({
          severity: 'warning',
          message: `Niveau de titre sauté (<h${lastHeading}> puis <h${level}>).`,
          line,
        });
      }

      lastHeading = level;
    }
  }

  for (const unclosed of stack) {
    if (!OPTIONAL_CLOSE.has(unclosed.tag)) {
      issues.push({
        severity: 'error',
        message: `Balise <${unclosed.tag}> non fermée.`,
        line: unclosed.line,
      });
    }
  }

  const emptyParagraph = /<p(\s[^>]*)?>(\s|&nbsp;|<br\s*\/?>)*<\/p>/gi;

  while ((match = emptyParagraph.exec(cleaned)) !== null) {
    issues.push({
      severity: 'warning',
      message: 'Paragraphe vide.',
      line: lineOf(cleaned, match.index),
    });
  }

  return issues.sort((a, b) => a.line - b.line);
}

function isBlock(node: Node): boolean {
  return (
    node.nodeType === Node.ELEMENT_NODE &&
    BLOCK_ELEMENTS.has((node as Element).tagName.toLowerCase())
  );
}

function openTag(element: Element): string {
  const clone = element.cloneNode(false) as Element;
  const html = clone.outerHTML;

  return html.slice(0, html.indexOf('>') + 1);
}

function formatChildren(parent: Node, depth: number): string[] {
  const indent = '  '.repeat(depth);
  const lines: string[] = [];
  let inlineRun = '';

  const flushInline = () => {
    const text = inlineRun.trim();

    if (text) {
      lines.push(indent + text);
    }

    inlineRun = '';
  };

  for (const child of Array.from(parent.childNodes)) {
    if (isBlock(child)) {
      flushInline();
      lines.push(...formatBlock(child as Element, depth));
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      inlineRun += (child as Element).outerHTML;
    } else if (child.nodeType === Node.TEXT_NODE) {
      inlineRun += (child.textContent ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\s+/g, ' ');
    } else if (child.nodeType === Node.COMMENT_NODE) {
      inlineRun += `<!--${child.textContent}-->`;
    }
  }

  flushInline();

  return lines;
}

function formatBlock(element: Element, depth: number): string[] {
  const indent = '  '.repeat(depth);
  const tag = element.tagName.toLowerCase();

  if (VOID_ELEMENTS.has(tag) || RAW_ELEMENTS.has(tag)) {
    return [indent + element.outerHTML];
  }

  const hasBlockChild = Array.from(element.childNodes).some(isBlock);

  if (!hasBlockChild) {
    return [indent + element.outerHTML.replace(/\s*\n\s*/g, ' ')];
  }

  return [
    indent + openTag(element),
    ...formatChildren(element, depth + 1),
    `${indent}</${tag}>`,
  ];
}

/** Réindente le HTML : une ligne par bloc, 2 espaces par niveau. */
export function formatHtml(source: string): string {
  const trimmed = source.trim();

  if (!trimmed || typeof DOMParser === 'undefined') {
    return trimmed;
  }

  const body = new DOMParser().parseFromString(trimmed, 'text/html').body;

  return formatChildren(body, 0).join('\n');
}
