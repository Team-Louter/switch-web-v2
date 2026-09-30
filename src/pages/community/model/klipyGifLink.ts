export interface CommunityKlipyGifLink {
  href: string;
  slug: string;
}

export interface CommunityCommentContent {
  text: string;
  klipyGifLinks: CommunityKlipyGifLink[];
}

const webUrlPattern = /https?:\/\/[^\s<>"']+/gi;
const trailingUrlPunctuationPattern = /[.,!?;:)\]]+$/;
const klipyGifPathPattern = /^\/gifs\/([a-z0-9-]+)\/?$/i;

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
    text = `${text.slice(0, removal.start)}${text.slice(removal.end)}`;
  }

  text = text
    .replace(/^[\t ]*\n+/, '')
    .replace(/\n+[\t ]*$/, '')
    .replace(/\n{3,}/g, '\n\n');

  return { text, klipyGifLinks };
}
