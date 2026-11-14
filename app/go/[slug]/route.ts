import { NextRequest, NextResponse, after } from "next/server";
import { createHash } from "node:crypto";
import { getLinkBySlug, insertClick } from "@/lib/db";

const BOT_UA =
  /bot|crawler|spider|slurp|facebookexternal|whatsapp|telegrambot|curl|wget|python|headless|lighthouse|pingdom/i;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const link = await getLinkBySlug(slug);
  if (!link) return NextResponse.redirect(new URL("/", req.url), 302);

  const ua = req.headers.get("user-agent") ?? "";
  const is_bot = BOT_UA.test(ua);
  const click = {
    link_id: link.id,
    utm_source: req.nextUrl.searchParams.get("utm_source"),
    utm_medium: req.nextUrl.searchParams.get("utm_medium"),
    referer: req.headers.get("referer"),
    ua_hash: createHash("sha256").update(ua).digest("hex").slice(0, 32),
    is_bot,
  };
  // Log after the response is sent so the redirect never waits on the DB.
  after(() => insertClick(click));

  const dest = new URL(link.dest_url);
  const src = req.nextUrl.searchParams.get("utm_source");
  if (src && !dest.searchParams.has("utm_source")) {
    dest.searchParams.set("utm_source", src);
  }
  return NextResponse.redirect(dest.toString(), 302);
}
