import { useState } from "react";
import type { ReactNode } from "react";
import type { Assessment } from "../domain/types";
import { reportMarkdown } from "../import-export/report";
import { download } from "../import-export/exchange";
import { Select } from "./ui";
const plain = (v: string) =>
  v
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\\([\[\]`])/g, "$1");
function renderLine(l: string, i: number): ReactNode {
  if (l.startsWith("#### ")) return <h4 key={i}>{plain(l.slice(5))}</h4>;
  if (l.startsWith("### ")) return <h3 key={i}>{plain(l.slice(4))}</h3>;
  if (l.startsWith("## ")) return <h2 key={i}>{plain(l.slice(3))}</h2>;
  if (l.startsWith("# ")) return <h1 key={i}>{plain(l.slice(2))}</h1>;
  if (!l) return null;
  const m = l.match(/^\*\*(.+?):\*\* (.*)$/);
  return (
    <p key={i}>
      {m ? (
        <>
          <strong>{plain(m[1])}: </strong>
          {plain(m[2])}
        </>
      ) : (
        plain(l).replace(/\*\*/g, "")
      )}
    </p>
  );
}
function reportBlocks(text: string) {
  const result: ReactNode[] = [];
  let block: ReactNode[] = [];
  let index = 0;
  const flush = () => {
    if (block.length) {
      result.push(
        <section className="report-block" key={`block-${index++}`}>
          {block}
        </section>,
      );
      block = [];
    }
  };
  text.split("\n").forEach((line, i) => {
    if (line.startsWith("#")) {
      flush();
      if (line.startsWith("#### ") || line === "## Methode und Versionsstand") {
        block.push(renderLine(line, i));
        return;
      }
    }
    if (block.length) block.push(renderLine(line, i));
    else result.push(renderLine(line, i));
  });
  flush();
  return result;
}
export function Report({ a }: { a: Assessment }) {
  const [selected, setSelected] = useState("");
  const revision = a.revisions.find((r) => r.revisionId === selected);
  const text = reportMarkdown(a, revision);
  return (
    <>
      <div className="no-print">
        <h1>Bericht</h1>
        <p className="intro">
          Alle offenen Punkte und Einschränkungen sind Teil des Ergebnisses.
        </p>
        <div className="toolbar">
          <Select
            label="Berichtsstand"
            value={selected}
            options={{
              "": "Aktueller Arbeitsstand",
              ...Object.fromEntries(
                a.revisions.map((r) => [
                  r.revisionId,
                  `Stand ${r.revisionNumber} · ${r.createdAt.slice(0, 10)} · ${r.createdBy}`,
                ]),
              ),
            }}
            onChange={setSelected}
          />
          <button
            onClick={() =>
              download(
                "KI-Resilienz-Bericht.md",
                text,
                "text/markdown;charset=utf-8",
              )
            }
          >
            Markdown exportieren
          </button>
          <button className="primary" onClick={() => window.print()}>
            Drucken / PDF speichern
          </button>
        </div>
      </div>
      <article className="report">{reportBlocks(text)}</article>
    </>
  );
}
