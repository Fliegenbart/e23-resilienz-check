import { useId } from "react";
import type { ReactNode } from "react";
import type { Assessment, EvidenceLink, QuestionId } from "../domain/types";
export type EditorProps = {
  a: Assessment;
  change: (fn: (a: Assessment) => void) => void;
};
export function Field({
  label,
  value,
  onChange,
  multiline = false,
  type = "text",
  placeholder = "",
  hint,
}: {
  label: string;
  value: string | number | null;
  onChange: (v: string) => void;
  multiline?: boolean;
  type?: string;
  placeholder?: string;
  hint?: string;
}) {
  const id = useId();
  return (
    <div className={"field" + (multiline ? " wide" : "")}>
      <label htmlFor={id}>{label}</label>
      {multiline ? (
        <textarea
          id={id}
          value={value ?? ""}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value ?? ""}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}{" "}
      {hint && <small>{hint}</small>}
    </div>
  );
}
export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Record<string, string>;
}) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        {Object.entries(options).map(([v, text]) => (
          <option key={v} value={v}>
            {text}
          </option>
        ))}
      </select>
    </div>
  );
}
export function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="check">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}
export function Section({
  title,
  children,
  actions,
}: {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="section">
      <div className="section-heading">
        <h2>{title}</h2>
        {actions}
      </div>
      {children}
    </section>
  );
}
export function TextFields({
  object,
  fields,
  onChange,
}: {
  object: any;
  fields: Record<string, string>;
  onChange: (key: string, value: string) => void;
}) {
  return (
    <div className="form-grid">
      {Object.entries(fields).map(([k, l]) => (
        <Field
          key={k}
          label={l}
          value={object[k]}
          multiline={
            ![
              "title",
              "owner",
              "actor",
              "person",
              "kind",
              "authorOrOrigin",
              "internalReference",
              "assessedBy",
              "customerAlias",
              "user",
              "economicBuyer",
              "currency",
            ].includes(k)
          }
          onChange={(v) => onChange(k, v)}
        />
      ))}
    </div>
  );
}
export function Multi({
  label,
  values,
  options,
  onChange,
}: {
  label: string;
  values: string[];
  options: { id: string; title: string }[];
  onChange: (v: string[]) => void;
}) {
  return (
    <fieldset className="multi">
      <legend>{label}</legend>
      {options.length ? (
        options.map((o) => (
          <Check
            key={o.id}
            label={o.title}
            checked={values.includes(o.id)}
            onChange={(yes) =>
              onChange(
                yes ? [...values, o.id] : values.filter((x) => x !== o.id),
              )
            }
          />
        ))
      ) : (
        <small>Noch keine Einträge.</small>
      )}
    </fieldset>
  );
}
export function Sources({
  a,
  links,
  onChange,
}: {
  a: Assessment;
  links: EvidenceLink[];
  onChange: (v: EvidenceLink[]) => void;
}) {
  return (
    <div className="source-links">
      <h4>Verknüpfte Quellen</h4>
      {links.map((l, i) => (
        <div className="source-link" key={l.evidenceId}>
          <strong>
            {a.content.evidence.find((e) => e.id === l.evidenceId)?.title ??
              "Quelle fehlt"}
          </strong>
          <Select
            label="Beziehung"
            value={l.relation}
            options={{
              supports: "Unterstützt",
              contradicts: "Widerspricht",
              context: "Kontext",
            }}
            onChange={(v) =>
              onChange(
                links.map((x, j) =>
                  j === i
                    ? { ...x, relation: v as EvidenceLink["relation"] }
                    : x,
                ),
              )
            }
          />
          <Field
            label="Bezug zur konkreten Aussage"
            value={l.explanation}
            onChange={(v) =>
              onChange(
                links.map((x, j) => (j === i ? { ...x, explanation: v } : x)),
              )
            }
          />
          <button
            type="button"
            className="quiet"
            onClick={() => onChange(links.filter((_, j) => i !== j))}
          >
            Zuordnung entfernen
          </button>
        </div>
      ))}
      <Select
        label="Quelle zuordnen"
        value=""
        options={{
          "": "Quelle auswählen …",
          ...Object.fromEntries(
            a.content.evidence
              .filter((e) => !links.some((l) => l.evidenceId === e.id))
              .map((e) => [e.id, e.title]),
          ),
        }}
        onChange={(v) => {
          if (v)
            onChange([
              ...links,
              { evidenceId: v, relation: "supports", explanation: "" },
            ]);
        }}
      />
      {!a.content.evidence.length && (
        <p className="muted">Quellen zuerst im Bereich „Belege“ anlegen.</p>
      )}
    </div>
  );
}
export function Reviewer({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return <Field label="Prüfende Person" value={value} onChange={onChange} />;
}
