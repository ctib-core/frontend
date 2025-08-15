type CryptoPanicItem = {
  id: number;
  title: string;
  description?: string;
  published_at?: string;
  source?: { title?: string; region?: string; domain?: string; type?: string };
  instruments?: { code?: string; title?: string }[];
  url?: string;
  original_url?: string;
};

type CryptoPanicResponse = {
  next?: string | null;
  previous?: string | null;
  results?: CryptoPanicItem[];
};

export async function fetchCryptoPanicNews(params: {
  currencies?: string[]; // e.g., ["BTC","ETH"]
  filter?: string; // rising, hot, bullish, bearish, important, saved, lol
  kind?: 'news' | 'media' | 'all';
  region?: string; // en, fr, ...
}): Promise<CryptoPanicItem[]> {
  const token = process.env.CRYPTOPANIC_TOKEN;
  const base = 'https://cryptopanic.com/api/developer/v2/posts/';

  const qs: Record<string, string> = {};
  if (token) qs.auth_token = token;
  // Use public mode to avoid private-user settings affecting results
  qs.public = 'true';
  if (params.currencies?.length) qs.currencies = params.currencies.join(',');
  if (params.filter) qs.filter = params.filter;
  if (params.kind) qs.kind = params.kind;
  if (params.region) qs.regions = params.region;

  const url = `${base}?${new URLSearchParams(qs).toString()}`;

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) {
      console.warn('CryptoPanic API error', res.status, res.statusText);
      return [];
    }
    const data: CryptoPanicResponse = await res.json();
    return data.results || [];
  } catch (e) {
    console.warn('CryptoPanic fetch failed', e);
    return [];
  }
}

export function summarizeNews(items: CryptoPanicItem[], limit = 5) {
  return items.slice(0, limit).map((it) => ({
    id: it.id,
    title: it.title,
    description: it.description,
    published_at: it.published_at,
    source: it.source?.title,
    url: it.url || it.original_url,
    instruments: (it.instruments || []).map((i) => i.code).filter(Boolean),
  }));
}


