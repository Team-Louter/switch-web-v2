const KLIPY_API_BASE_URL = 'https://api.klipy.com/api/v1';
const KLIPY_MEDIA_HOSTS = new Set([
  'static.klipy.com',
  'static1.klipy.com',
  'static2.klipy.com',
]);

interface KlipyGifFileVariant {
  url?: unknown;
  width?: unknown;
  height?: unknown;
}

interface KlipyGifFileSize {
  gif?: KlipyGifFileVariant;
  webp?: KlipyGifFileVariant;
}

interface KlipyGifApiItem {
  slug?: unknown;
  title?: unknown;
  content_description?: unknown;
  username?: unknown;
  source?: unknown;
  user?: unknown;
  file?: unknown;
}

export interface KlipyGifPreview {
  url: string;
  title: string;
  contentDescription: string;
  creatorName: string;
  source: string;
  width?: number;
  height?: number;
}

export interface KlipyGif extends KlipyGifPreview {
  slug: string;
}

interface KlipyGifListRequest {
  query: string;
  page: number;
  signal: AbortSignal;
}

interface KlipyGifListApiResponse {
  result: true;
  data: {
    data: unknown[];
    has_next: boolean;
  };
}

export interface KlipyGifPage {
  items: KlipyGif[];
  hasNext: boolean;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null
    ? value as Record<string, unknown>
    : null;
}

function asTrimmedString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function isKlipyMediaUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && KLIPY_MEDIA_HOSTS.has(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}

function getKlipyMediaUrl(file: unknown): KlipyGifFileVariant | null {
  const sizes = asRecord(file);
  if (!sizes) return null;

  for (const sizeName of ['sm', 'md', 'hd', 'xs']) {
    const size = asRecord(sizes[sizeName]) as KlipyGifFileSize | null;
    const variant = size?.gif ?? size?.webp;
    if (!variant || typeof variant.url !== 'string') continue;

    if (isKlipyMediaUrl(variant.url)) return variant;
  }

  return null;
}

function getOptionalAttribution(item: KlipyGifApiItem): {
  creatorName: string;
  source: string;
} {
  const user = asRecord(item.user);
  return {
    creatorName:
      asTrimmedString(item.username) ||
      asTrimmedString(user?.username) ||
      asTrimmedString(user?.name),
    source: asTrimmedString(item.source),
  };
}

export function isKlipyGifApiConfigured(): boolean {
  return Boolean(import.meta.env.VITE_KLIPY_APP_KEY?.trim());
}

export async function getKlipyGifs({
  query,
  page,
  signal,
}: KlipyGifListRequest): Promise<KlipyGifPage> {
  const appKey = import.meta.env.VITE_KLIPY_APP_KEY?.trim();
  if (!appKey) throw new Error('GIF 검색을 사용할 수 없습니다.');

  const searchQuery = query.trim();
  const params = new URLSearchParams({
    page: String(page),
    per_page: '24',
    locale: 'kr',
  });
  if (searchQuery) params.set('q', searchQuery);

  // 외부 GIF 조회에는 서비스의 인증 토큰과 쿠키를 전달하지 않습니다.
  const response = await fetch(
    `${KLIPY_API_BASE_URL}/${encodeURIComponent(appKey)}/gifs/${searchQuery ? 'search' : 'trending'}?${params}`,
    {
      cache: 'no-store',
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      signal,
    },
  );
  if (!response.ok) throw new Error('GIF를 불러오지 못했습니다.');

  const payload: unknown = await response.json();
  const root = asRecord(payload);
  const data = asRecord(root?.data);
  if (root?.result !== true || !Array.isArray(data?.data)
    || typeof data.has_next !== 'boolean') {
    throw new Error('GIF 응답 형식이 올바르지 않습니다.');
  }

  const result: KlipyGifListApiResponse = {
    result: root.result,
    data: { data: data.data, has_next: data.has_next },
  };
  const items: KlipyGif[] = [];

  for (const value of result.data.data) {
    const item = asRecord(value);
    const slug = asTrimmedString(item?.slug);
    if (!item || item.type !== 'gif' || !/^[a-z0-9-]+$/i.test(slug)) continue;

    const media = getKlipyMediaUrl(item.file);
    if (!media || typeof media.url !== 'string') continue;

    items.push({
      slug,
      url: media.url,
      title: asTrimmedString(item.title),
      contentDescription: asTrimmedString(item.content_description),
      ...getOptionalAttribution(item),
      width: typeof media.width === 'number' ? media.width : undefined,
      height: typeof media.height === 'number' ? media.height : undefined,
    });
  }

  return { items, hasNext: result.data.has_next };
}

export async function getKlipyGifPreview(
  slug: string,
  signal: AbortSignal,
): Promise<KlipyGifPreview | null> {
  if (!/^[a-z0-9-]+$/i.test(slug)) throw new Error('유효하지 않은 KLIPY GIF slug입니다.');

  const appKey = import.meta.env.VITE_KLIPY_APP_KEY?.trim();
  if (!appKey) return null;

  const params = new URLSearchParams({ slugs: slug });
  const response = await fetch(
    `${KLIPY_API_BASE_URL}/${encodeURIComponent(appKey)}/gifs/items?${params}`,
    {
      cache: 'no-store',
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      signal,
    },
  );
  if (!response.ok) throw new Error('KLIPY GIF 정보를 불러오지 못했습니다.');

  const payload: unknown = await response.json();
  const root = asRecord(payload);
  const data = asRecord(root?.data);
  const items = data?.data;
  if (root?.result !== true || !Array.isArray(items)) {
    throw new Error('KLIPY GIF 응답 형식이 올바르지 않습니다.');
  }

  const candidates = items.map(asRecord);
  // 목록의 slug에는 공유용 접미사가 붙지만 Items 응답은 이를 제외한 slug를 반환할 수 있습니다.
  const canonicalSlug = slug.replace(/--[a-z0-9]+$/i, '');
  const item = (
    candidates.find((candidate) => candidate?.slug === slug)
    ?? candidates.find((candidate) => candidate?.slug === canonicalSlug)
  ) as KlipyGifApiItem | undefined;
  if (!item) return null;

  const media = getKlipyMediaUrl(item.file);
  if (!media || typeof media.url !== 'string') return null;

  const attribution = getOptionalAttribution(item);
  return {
    url: media.url,
    title: asTrimmedString(item.title),
    contentDescription: asTrimmedString(item.content_description),
    creatorName: attribution.creatorName,
    source: attribution.source,
    width: typeof media.width === 'number' ? media.width : undefined,
    height: typeof media.height === 'number' ? media.height : undefined,
  };
}
