import { workspaceSchema, validateReferences } from "../domain/schema";
import type { Assessment, WorkspaceExport } from "../domain/types";
import { APP_VERSION, SCHEMA_VERSION } from "../methodology/config";
export function serialize(assessments: Assessment[]) {
  return JSON.stringify(
    {
      format: "ai-resilience-check",
      schemaVersion: SCHEMA_VERSION,
      appVersion: APP_VERSION,
      exportedAt: new Date().toISOString(),
      assessments,
    },
    null,
    2,
  );
}
export function parseImport(text: string): WorkspaceExport {
  if (new TextEncoder().encode(text).length > 5 * 1024 * 1024)
    throw Error("Die Datei überschreitet das Importlimit von 5 MiB.");
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw Error("Die Datei enthält kein gültiges JSON.");
  }
  const result = workspaceSchema.safeParse(parsed);
  if (!result.success)
    throw Error(
      "Import abgewiesen: " +
        result.error.issues
          .slice(0, 4)
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join("; "),
    );
  const data = result.data as unknown as WorkspaceExport;
  const ids = new Set<string>();
  for (const a of data.assessments) {
    if (ids.has(a.id)) throw Error("Doppelte Fall-ID in der Datei.");
    ids.add(a.id);
    validateReferences(a);
  }
  return data;
}
export function applyImport(
  existing: Assessment[],
  incoming: Assessment[],
  mode: "copy" | "replace",
): Assessment[] {
  const result = structuredClone(existing);
  for (const source of incoming) {
    const a = structuredClone(source);
    if (mode === "copy") {
      a.originAssessmentId = a.id;
      a.id = crypto.randomUUID();
    }
    const index = result.findIndex((x) => x.id === a.id);
    if (index >= 0) result[index] = a;
    else result.push(a);
  }
  return result;
}
export function safeUrl(url: string | null) {
  if (!url) return null;
  try {
    const u = new URL(url);
    return ["https:", "http:"].includes(u.protocol) ? u.href : null;
  } catch {
    return null;
  }
}
export function download(
  name: string,
  text: string,
  type = "text/plain;charset=utf-8",
) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const el = document.createElement("a");
  el.href = url;
  el.download = name;
  document.body.appendChild(el);
  el.click();
  el.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
