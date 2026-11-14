import { notFound } from "next/navigation";
import { getArticle } from "@/lib/db";
import { Markdown } from "@/lib/markdown";

export const revalidate = 300;

const DISCLOSURE: Record<string, string> = {
  en: "Disclosure: this article contains affiliate links - we may earn a commission at no extra cost to you.",
  vi: "Lộ diện: bài viết có link tiếp thị liên kết - chúng tôi có thể nhận hoa hồng, bạn không tốn thêm chi phí.",
};

const NO_ADVICE: Record<string, string> = {
  en: "Not financial advice. Do your own research before trading.",
  vi: "Đây không phải lời khuyên đầu tư. Tự nghiên cứu trước khi giao dịch.",
};

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const article = await getArticle(lang, slug);
  if (!article) notFound();

  const disclosure = DISCLOSURE[lang] ?? DISCLOSURE.en;
  const noAdvice = NO_ADVICE[lang] ?? NO_ADVICE.en;

  return (
    <main>
      <p style={{ color: "#8b93a3", fontSize: "0.8rem", marginBottom: "0.25rem" }}>
        {lang.toUpperCase()}
        {article.published_at
          ? ` - ${new Date(article.published_at).toISOString().slice(0, 10)}`
          : ""}
      </p>
      <h1 style={{ fontSize: "1.9rem", lineHeight: 1.3, marginTop: 0 }}>
        {article.title}
      </h1>
      <aside
        style={{
          border: "1px solid #2a3040",
          borderLeft: "3px solid #f0b90b",
          background: "#12161f",
          padding: "0.75rem 1rem",
          borderRadius: 6,
          fontSize: "0.8rem",
          color: "#b8bfcc",
          marginBottom: "1.5rem",
        }}
      >
        {disclosure}
        <br />
        {noAdvice}
      </aside>
      <article style={{ fontSize: "1rem" }}>
        <Markdown body={article.body_md ?? article.square_variant_md ?? ""} />
      </article>
      <a
        href="/go/binance-ref?utm_source=article"
        rel="sponsored nofollow"
        style={{
          display: "block",
          marginTop: "2rem",
          padding: "0.9rem 1.25rem",
          borderRadius: 8,
          background: "#f0b90b",
          color: "#0b0e13",
          fontWeight: 700,
          textDecoration: "none",
          textAlign: "center",
        }}
      >
        {lang === "vi" || lang === "bi"
          ? "Mở tài khoản Binance - nhận ưu đãi phí giao dịch →"
          : "Open a Binance account - get a trading fee rebate →"}
      </a>
      {article.faq_json && article.faq_json.length > 0 && (
        <section style={{ marginTop: "2.5rem" }}>
          <h2>FAQ</h2>
          {article.faq_json.map((f, i) => (
            <details
              key={i}
              style={{
                border: "1px solid #232833",
                borderRadius: 6,
                padding: "0.75rem 1rem",
                marginBottom: "0.6rem",
              }}
            >
              <summary style={{ cursor: "pointer", fontWeight: 600 }}>
                {f.q}
              </summary>
              <p style={{ color: "#b8bfcc", marginBottom: 0 }}>{f.a}</p>
            </details>
          ))}
        </section>
      )}
    </main>
  );
}
