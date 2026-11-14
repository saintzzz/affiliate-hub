import type { MetadataRoute } from "next";
import { listArticles } from "@/lib/db";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.SITE_URL ?? "http://localhost:3000";
  const articles = await listArticles();
  return [
    { url: base, lastModified: new Date() },
    ...articles.map((a) => ({
      url: `${base}/${a.lang}/${a.slug}`,
      lastModified: a.published_at ? new Date(a.published_at) : new Date(),
    })),
  ];
}
