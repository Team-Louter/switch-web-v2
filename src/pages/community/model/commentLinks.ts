const webUrlPattern = /\bhttps?:\/\/[^\s<>"']+/gi;
const trailingPunctuation = /[.,!?;:…]/u;
const openingBracket: Record<string, string> = { ')': '(', ']': '[', '}': '{' };

interface CommentLink {
  href: string;
  start: number;
  end: number;
}

function stripTrailingPunctuation(rawUrl: string): string {
  const brackets = new Map<string, number>();
  for (const character of rawUrl) {
    if ('()[]{}'.includes(character)) {
      brackets.set(character, (brackets.get(character) ?? 0) + 1);
    }
  }

  let end = rawUrl.length;
  while (end > 0) {
    const character = rawUrl[end - 1];
    if (!trailingPunctuation.test(character)) {
      const opening = openingBracket[character];
      const closingCount = brackets.get(character) ?? 0;
      if (!opening || closingCount <= (brackets.get(opening) ?? 0)) break;
      brackets.set(character, closingCount - 1);
    }
    end -= 1;
  }

  return rawUrl.slice(0, end);
}

export function findCommentLinks(text: string): CommentLink[] {
  const links: CommentLink[] = [];

  for (const match of text.matchAll(webUrlPattern)) {
    const value = stripTrailingPunctuation(match[0]);
    try {
      const url = new URL(value);
      if (url.username || url.password) continue;
      links.push({ href: url.href, start: match.index, end: match.index + value.length });
    } catch {
      // URL로 해석할 수 없는 입력은 원래 텍스트로 표시합니다.
    }
  }

  return links;
}
