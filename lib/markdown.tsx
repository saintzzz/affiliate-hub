import type { ReactNode } from "react";

// Minimal markdown renderer for article bodies: headings, paragraphs,
// bold/italic inline, links, unordered/ordered lists, code spans.
// Article bodies come from our own pipeline (trusted, not user input).

function inline(text: string, keyBase: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const re = /(\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|`([^`]+)`|\*([^*]+)\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const k = `${keyBase}-${i++}`;
    if (m[2] !== undefined) {
      parts.push(
        <a
          key={k}
          href={m[3]}
          style={{ color: "#f0b90b" }}
          rel={m[3].startsWith("/go/") ? undefined : "sponsored nofollow"}
        >
          {m[2]}
        </a>,
      );
    } else if (m[4] !== undefined) {
      parts.push(<strong key={k}>{m[4]}</strong>);
    } else if (m[5] !== undefined) {
      parts.push(
        <code
          key={k}
          style={{
            background: "#1a1f2b",
            padding: "0.1em 0.35em",
            borderRadius: 4,
            fontSize: "0.9em",
          }}
        >
          {m[5]}
        </code>,
      );
    } else if (m[6] !== undefined) {
      parts.push(<em key={k}>{m[6]}</em>);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function Markdown({ body }: { body: string }) {
  const blocks = body.split(/\n{2,}/);
  return (
    <>
      {blocks.map((b, i) => {
        const t = b.trim();
        if (!t) return null;
        if (t.startsWith("### "))
          return <h3 key={i} style={{ marginTop: "1.8rem" }}>{inline(t.slice(4), `h3${i}`)}</h3>;
        if (t.startsWith("## "))
          return <h2 key={i} style={{ marginTop: "2.2rem" }}>{inline(t.slice(3), `h2${i}`)}</h2>;
        if (t.startsWith("# "))
          return <h1 key={i}>{inline(t.slice(2), `h1${i}`)}</h1>;
        if (/^[-*] /m.test(t)) {
          return (
            <ul key={i} style={{ paddingLeft: "1.4rem" }}>
              {t.split("\n").filter((l) => /^[-*] /.test(l)).map((l, j) => (
                <li key={j}>{inline(l.replace(/^[-*] /, ""), `li${i}-${j}`)}</li>
              ))}
            </ul>
          );
        }
        if (/^\d+\. /m.test(t)) {
          return (
            <ol key={i} style={{ paddingLeft: "1.4rem" }}>
              {t.split("\n").filter((l) => /^\d+\. /.test(l)).map((l, j) => (
                <li key={j}>{inline(l.replace(/^\d+\. /, ""), `ol${i}-${j}`)}</li>
              ))}
            </ol>
          );
        }
        return <p key={i}>{inline(t, `p${i}`)}</p>;
      })}
    </>
  );
}
