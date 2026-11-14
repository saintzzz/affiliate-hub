import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Trading Stack - crypto tools, bots and exchange guides",
  description:
    "Practical guides on crypto trading tools, bots, backtesting and exchange programs.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
          background: "#0b0e14",
          color: "#e6e9ef",
          lineHeight: 1.7,
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "2rem 1.25rem" }}>
          <header style={{ marginBottom: "2.5rem" }}>
            <a
              href="/"
              style={{
                color: "#f0b90b",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "1.1rem",
                letterSpacing: "0.02em",
              }}
            >
              tradingstack
            </a>
          </header>
          {children}
          <footer
            style={{
              marginTop: "4rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid #232833",
              color: "#8b93a3",
              fontSize: "0.8rem",
            }}
          >
            Some links on this site are affiliate links - we may earn a
            commission at no extra cost to you. Nothing here is financial
            advice.
          </footer>
        </div>
      </body>
    </html>
  );
}
