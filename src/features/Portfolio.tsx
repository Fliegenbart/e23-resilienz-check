import { useRef, useState } from "react";
import type { Assessment } from "../domain/types";
import { Field, Select, Section } from "./ui";
import { createAssessment, today } from "../domain/model";
import {
  applyImport,
  parseImport,
  serialize,
  download,
} from "../import-export/exchange";
import { examples } from "../fixtures/examples";
import { RECOMMENDATIONS } from "../import-export/report";
import { METHOD } from "../methodology/config";
export function Portfolio({
  cases,
  setCases,
  open,
  onError,
}: {
  cases: Assessment[];
  setCases: (v: Assessment[]) => void;
  open: (id: string) => void;
  onError: (e: unknown) => void;
}) {
  const [creating, setCreating] = useState(false),
    [title, setTitle] = useState(""),
    [question, setQuestion] = useState(""),
    [type, setType] = useState<"idea" | "existing">("existing");
  const [customer, setCustomer] = useState(""),
    [typeFilter, setTypeFilter] = useState(""),
    [recommendation, setRecommendation] = useState(""),
    [due, setDue] = useState(""),
    [sort, setSort] = useState("title");
  const [incoming, setIncoming] = useState<Assessment[] | null>(null),
    [mode, setMode] = useState<"copy" | "replace">("copy");
  const file = useRef<HTMLInputElement>(null);
  const list = cases
    .filter(
      (a) =>
        (!customer ||
          a.content.customerAlias
            .toLowerCase()
            .includes(customer.toLowerCase())) &&
        (!typeFilter || a.content.type === typeFilter) &&
        (!recommendation ||
          a.content.decision.recommendation === recommendation) &&
        (!due ||
          (!!a.content.decision.reviewDueAt &&
            a.content.decision.reviewDueAt.slice(0, 10) <= today())),
    )
    .sort((a, b) =>
      sort === "priority"
        ? a.content.actionPriority - b.content.actionPriority
        : sort === "due"
          ? (a.content.decision.reviewDueAt ?? "9999").localeCompare(
              b.content.decision.reviewDueAt ?? "9999",
            )
          : a.content.title.localeCompare(b.content.title, "de"),
    );
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Fallübersicht</h1>
          <p className="intro">
            Welche Teile Ihres Geschäfts bleiben mit leistungsfähigerer KI
            wertvoll — und welche Entscheidungen sollten Sie heute vorbereiten?
          </p>
        </div>
        <button className="primary" onClick={() => setCreating(true)}>
          Neuen Fall anlegen
        </button>
      </div>
      <div className="toolbar">
        <button onClick={() => setCases([...cases, ...examples()])}>
          Fiktive Beispiele laden
        </button>
        <button
          onClick={() =>
            download(
              "KI-Resilienz-Alle-Faelle.json",
              serialize(cases),
              "application/json",
            )
          }
        >
          Alle Fälle als JSON sichern
        </button>
        <button onClick={() => file.current?.click()}>JSON importieren</button>
        <input
          ref={file}
          hidden
          type="file"
          accept=".json,application/json"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (!f) return;
            try {
              if (f.size > 5 * 1024 * 1024) throw Error("Importlimit: 5 MiB.");
              setIncoming(parseImport(await f.text()).assessments);
              setMode("copy");
            } catch (error) {
              onError(error);
            }
          }}
        />
      </div>
      {creating && (
        <Section title="Neuer Fall">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!title.trim() || !question.trim()) return;
              const a = createAssessment(title.trim(), type, question.trim());
              setCases([...cases, a]);
              setCreating(false);
              setTitle("");
              setQuestion("");
              open(a.id);
            }}
          >
            <div className="form-grid">
              <Field
                label="Titel des Geschäftsfelds oder der Idee"
                value={title}
                onChange={setTitle}
              />
              <Select
                label="Typ"
                value={type}
                options={{
                  existing: "Bestehendes Geschäft",
                  idea: "Neue Idee",
                }}
                onChange={(v) => setType(v as any)}
              />
              <Field
                label="Welche Entscheidung soll vorbereitet werden?"
                multiline
                value={question}
                onChange={setQuestion}
              />
            </div>
            <div className="toolbar">
              <button
                type="submit"
                className="primary"
                disabled={!title.trim() || !question.trim()}
              >
                Fall erstellen
              </button>
              <button type="button" onClick={() => setCreating(false)}>
                Abbrechen
              </button>
            </div>
          </form>
        </Section>
      )}
      {incoming && (
        <Section title="Importvorschau">
          <p>
            {incoming.length} Fälle. Bestehende Daten werden erst bei Übernahme
            verändert.
          </p>
          <ul>
            {incoming.map((a) => (
              <li key={a.id}>
                {a.content.title}
                {cases.some((x) => x.id === a.id)
                  ? " — ID bereits vorhanden"
                  : ""}
                {a.methodologyVersion !== METHOD.version
                  ? " — unbekannte Methode, nur lesbar"
                  : ""}
              </li>
            ))}
          </ul>
          <Select
            label="Umgang mit Fall-IDs"
            value={mode}
            options={{
              copy: "Als zusätzliche Kopien mit neuen Fall-IDs importieren (Standard)",
              replace: "Bestehende Fälle mit gleicher ID ersetzen",
            }}
            onChange={(v) => setMode(v as any)}
          />
          <div className="toolbar">
            <button
              className="primary"
              onClick={() => {
                setCases(applyImport(cases, incoming, mode));
                setIncoming(null);
              }}
            >
              Import übernehmen
            </button>
            <button onClick={() => setIncoming(null)}>Import abbrechen</button>
          </div>
        </Section>
      )}
      {cases.length ? (
        <>
          <div className="filter-bar">
            <Field
              label="Kunde / Alias filtern"
              value={customer}
              onChange={setCustomer}
            />
            <Select
              label="Falltyp"
              value={typeFilter}
              options={{
                "": "Alle Typen",
                existing: "Bestehendes Geschäft",
                idea: "Neue Idee",
              }}
              onChange={setTypeFilter}
            />
            <Select
              label="Empfehlung"
              value={recommendation}
              options={{ "": "Alle Empfehlungen", ...RECOMMENDATIONS }}
              onChange={setRecommendation}
            />
            <Select
              label="Überprüfung"
              value={due}
              options={{ "": "Alle Termine", due: "Fällig / überfällig" }}
              onChange={setDue}
            />
            <Select
              label="Sortieren nach"
              value={sort}
              options={{
                title: "Titel",
                due: "Überprüfungstermin",
                priority: "Manuelle Handlungspriorität",
              }}
              onChange={setSort}
            />
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Geschäftsfeld / Kunde</th>
                  <th>Typ und Bearbeitung</th>
                  <th>Empfehlung</th>
                  <th>Bedrohung / Vorteil / offene Frage</th>
                  <th>Nächster Schritt</th>
                </tr>
              </thead>
              <tbody>
                {list.map((a) => {
                  const c = a.content,
                    ac = c.actions.find(
                      (x) => x.status === "open" || x.status === "in_progress",
                    );
                  return (
                    <tr key={a.id}>
                      <td>
                        <button
                          className="text-button"
                          onClick={() => open(a.id)}
                        >
                          {c.title}
                        </button>
                        <small>
                          {c.customerAlias || "Kunde noch offen"}
                          {a.isExample ? " · Fiktives Beispiel" : ""}
                        </small>
                      </td>
                      <td>
                        {c.type === "idea" ? "Neue Idee" : "Bestehend"}
                        <small>
                          {a.methodologyVersion !== METHOD.version
                            ? "Nur lesbar"
                            : a.status === "reviewed"
                              ? "Fachlich durchgesehen"
                              : "Entwurf"}{" "}
                          · Priorität {c.actionPriority}
                        </small>
                      </td>
                      <td>
                        {RECOMMENDATIONS[c.decision.recommendation]}
                        <small>
                          Überprüfung: {c.decision.reviewDueAt || "Offen"}
                        </small>
                      </td>
                      <td>
                        <strong>Bedrohung:</strong>{" "}
                        {c.executiveSummary.mainThreat || "Offen"}
                        <br />
                        <strong>Vorteil:</strong>{" "}
                        {c.executiveSummary.evidencedAdvantage || "Offen"}
                        <br />
                        <strong>Frage:</strong>{" "}
                        {c.executiveSummary.keyUnknown || "Offen"}
                      </td>
                      <td>
                        {ac?.title || "Noch offen"}
                        <small>
                          {ac?.owner || "Verantwortung offen"} ·{" "}
                          {ac?.dueAt || "Termin offen"}
                        </small>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {!list.length && <p>Keine Fälle entsprechen den Filtern.</p>}
        </>
      ) : (
        <div className="empty">
          <div className="empty-mark">↗</div>
          <h2>Eine Entscheidung beginnt mit einem klaren Fall.</h2>
          <p>
            Untersuchen Sie ein konkretes Angebot für eine Kundengruppe. Oder
            lernen Sie den Ablauf mit drei ausdrücklich fiktiven Beispielen
            kennen.
          </p>
          <p className="muted">
            Ihre Fälle bleiben in diesem Browser. Sichern Sie wichtige
            Arbeitsstände regelmäßig als JSON.
          </p>
        </div>
      )}
    </>
  );
}
