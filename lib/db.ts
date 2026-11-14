// Server-side Supabase REST client for the gtm schema.
// Env: GTM_SUPABASE_URL + GTM_SERVICE_ROLE_KEY - never shipped to client
// (only used in route handlers and server components).
const URL_ = () => process.env.GTM_SUPABASE_URL ?? "";
const SVC = () => process.env.GTM_SERVICE_ROLE_KEY ?? "";

const H = () => ({
  apikey: SVC(),
  Authorization: `Bearer ${SVC()}`,
  "Accept-Profile": "gtm",
  "Content-Profile": "gtm",
  "Content-Type": "application/json",
});

export type AffLink = {
  id: string;
  slug: string;
  dest_url: string;
  cluster: string | null;
  lang: string | null;
  status: string;
};

export type AffArticle = {
  id: string;
  slug: string;
  lang: string;
  title: string;
  body_md: string | null;
  square_variant_md: string | null;
  faq_json: { q: string; a: string }[] | null;
  link_plan: { slug: string; anchor?: string }[] | null;
  status: string;
  published_at: string | null;
};

export async function getLinkBySlug(slug: string): Promise<AffLink | null> {
  const res = await fetch(
    `${URL_()}/rest/v1/aff_links?slug=eq.${encodeURIComponent(slug)}&status=eq.active&select=id,slug,dest_url,cluster,lang,status&limit=1`,
    { headers: H(), cache: "no-store" },
  );
  if (!res.ok) return null;
  const rows = await res.json();
  return rows[0] ?? null;
}

export async function insertClick(row: {
  link_id: string;
  utm_source?: string | null;
  utm_medium?: string | null;
  referer?: string | null;
  ua_hash?: string | null;
  is_bot: boolean;
}): Promise<void> {
  await fetch(`${URL_()}/rest/v1/aff_clicks`, {
    method: "POST",
    headers: { ...H(), Prefer: "return=minimal" },
    body: JSON.stringify([row]),
    signal: AbortSignal.timeout(5000),
  }).catch(() => {});
}

export async function listArticles(lang?: string): Promise<AffArticle[]> {
  const langFilter = lang ? `&lang=eq.${lang}` : "";
  const res = await fetch(
    `${URL_()}/rest/v1/aff_articles?status=eq.published${langFilter}&select=id,slug,lang,title,published_at&order=published_at.desc&limit=200`,
    { headers: H(), next: { revalidate: 300 } },
  );
  if (!res.ok) return [];
  return res.json();
}

export async function getArticle(
  lang: string,
  slug: string,
): Promise<AffArticle | null> {
  const res = await fetch(
    `${URL_()}/rest/v1/aff_articles?status=eq.published&lang=eq.${encodeURIComponent(lang)}&slug=eq.${encodeURIComponent(slug)}&select=id,slug,lang,title,body_md,square_variant_md,faq_json,link_plan,status,published_at&limit=1`,
    { headers: H(), next: { revalidate: 300 } },
  );
  if (!res.ok) return null;
  const rows = await res.json();
  return rows[0] ?? null;
}
