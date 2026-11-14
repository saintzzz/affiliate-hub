import Link from "next/link";
import { listArticles } from "@/lib/db";

export const revalidate = 300;

export default async function Home() {
  const articles = await listArticles();
  return (
    <main>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
        Guides that pay for themselves
      </h1>
      <p style={{ color: "#8b93a3", marginTop: 0 }}>
        Hands-on notes on crypto trading tools, automation and exchange
        programs - from someone who runs the stack.
      </p>
      <a
        href="/go/binance-ref?utm_source=home"
        rel="sponsored nofollow"
        style={{
          display: "inline-block",
          marginTop: "0.75rem",
          padding: "0.7rem 1.2rem",
          borderRadius: 8,
          background: "#f0b90b",
          color: "#0b0e13",
          fontWeight: 700,
          textDecoration: "none",
        }}
      >
        Open a Binance account - trading fee rebate →
      </a>
      <ul style={{ listStyle: "none", padding: 0, marginTop: "2rem" }}>
        {articles.map((a) => (
          <li key={a.id} style={{ marginBottom: "1.25rem" }}>
            <Link
              href={`/${a.lang}/${a.slug}`}
              style={{ color: "#e6e9ef", fontSize: "1.05rem", fontWeight: 600 }}
            >
              {a.title}
            </Link>
            <div style={{ color: "#8b93a3", fontSize: "0.8rem" }}>
              {a.lang.toUpperCase()}
              {a.published_at
                ? ` - ${new Date(a.published_at).toISOString().slice(0, 10)}`
                : ""}
            </div>
          </li>
        ))}
        {articles.length === 0 && (
          <li style={{ color: "#8b93a3" }}>First articles shipping soon.</li>
        )}
      </ul>
    </main>
  );
}
