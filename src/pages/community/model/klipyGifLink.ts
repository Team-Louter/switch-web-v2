export interface CommunityKlipyGifLink {
  href: string;
  slug: string;
}

export interface CommunityCommentContent {
  text: string;
  klipyGifLinks: CommunityKlipyGifLink[];
}

function removeLinkAndNormalizeBoundary(
  text: string,
  start: number,
  end: number,
): string {
  const before = text.slice(0, start);
  const after = text.slice(end);

  if (!before) return after.replace(/^[\t \r\n]+/, '');
  if (!after) return before.replace(/[\t \r\n]+$/, '');

  const beforeGap = before.match(/[\t \r\n]+$/)?.[0] ?? '';
  const afterGap = after.match(/^[\t \r\n]+/)?.[0] ?? '';
  if (!beforeGap || !afterGap) return `${before}${after}`;

  const boundaryGap = `${beforeGap}${afterGap}`;
  const lineBreaks = boundaryGap.match(/\r\n|\r|\n/g);
  const lineBreak = boundaryGap.includes('\r\n')
    ? '\r\n'
    : boundaryGap.includes('\r')
      ? '\r'
      : '\n';
  const separator = lineBreaks?.length
    ? lineBreak.repeat(Math.min(lineBreaks.length, 2))
    : ' ';

  return `${before.slice(0, -beforeGap.length)}${separator}${after.slice(afterGap.length)}`;
}

const webUrlPattern = /https?:\/\/[^\s<>"']+/gi;
const trailingUrlPunctuationPattern = /[.,!?;:)\]]+$/;
const klipyGifPathPattern = /^\/gifs\/([a-z0-9-]+)\/?$/i;

export function buildCommunityGifCommentContent(content: string, gifSlug?: string): string {
  const gifLink = gifSlug ? `https://klipy.com/gifs/${encodeURIComponent(gifSlug)}` : '';
  return [content.trim(), gifLink].filter(Boolean).join('\n');
}

function parseKlipyGifLink(value: string): CommunityKlipyGifLink | null {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();

    if (
      url.protocol !== 'https:' ||
      (hostname !== 'klipy.com' && hostname !== 'www.klipy.com') ||
      url.username ||
      url.password ||
      url.port
    ) {
      return null;
    }

    const pathMatch = klipyGifPathPattern.exec(url.pathname);
    if (!pathMatch) return null;

    return { href: url.href, slug: pathMatch[1] };
  } catch {
    return null;
  }
}

export function extractCommunityKlipyGifLinks(
  content: string,
): CommunityCommentContent {
  const klipyGifLinks: CommunityKlipyGifLink[] = [];
  const removals: Array<{ start: number; end: number }> = [];

  for (const match of content.matchAll(webUrlPattern)) {
    if (match.index === undefined) continue;

    const rawUrl = match[0];
    const trailingPunctuation = rawUrl.match(trailingUrlPunctuationPattern)?.[0] ?? '';
    const candidateUrl = rawUrl.slice(0, rawUrl.length - trailingPunctuation.length);
    const gifLink = parseKlipyGifLink(candidateUrl);
    if (!gifLink) continue;

    klipyGifLinks.push(gifLink);
    removals.push({
      start: match.index,
      end: match.index + candidateUrl.length,
    });
  }

  if (removals.length === 0) return { text: content, klipyGifLinks };

  let text = content;
  for (const removal of removals.reverse()) {
    text = removeLinkAndNormalizeBoundary(text, removal.start, removal.end);
  }

  return { text, klipyGifLinks };
}
