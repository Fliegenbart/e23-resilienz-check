import assert from "node:assert/strict";
import { mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";

// Vite resolves extensionless imports; deployed Node ESM does not.
// Compile and import the actual function without Vite or a model request.
const root = fileURLToPath(new URL("..", import.meta.url));
const output = await mkdtemp(path.join(tmpdir(), "e23-api-check-"));
try {
  const config = ts.readConfigFile(
    path.join(root, "tsconfig.json"),
    ts.sys.readFile,
  );
  const { options } = ts.parseJsonConfigFileContent(
    config.config,
    ts.sys,
    root,
  );
  const program = ts.createProgram(
    [
      path.join(root, "api/business-analysis.ts"),
      path.join(root, "api/stress-analysis.ts"),
    ],
    {
      ...options,
      noEmit: false,
      rootDir: root,
      outDir: output,
    },
  );
  const emitted = program.emit();
  const errors = [...ts.getPreEmitDiagnostics(program), ...emitted.diagnostics];
  assert.equal(
    errors.length,
    0,
    ts.formatDiagnosticsWithColorAndContext(errors, {
      getCanonicalFileName: (name) => name,
      getCurrentDirectory: () => root,
      getNewLine: () => "\n",
    }),
  );
  await writeFile(path.join(output, "package.json"), '{"type":"module"}');
  await symlink(
    path.join(root, "node_modules"),
    path.join(output, "node_modules"),
    "dir",
  );
  const { default: api } = await import(
    pathToFileURL(path.join(output, "api/business-analysis.js"))
  );
  const response = await api.fetch(
    new Request("https://example.test/api/business-analysis"),
  );
  assert.equal(response.status, 405);
  assert.equal(response.headers.get("Allow"), "POST");
  const { default: stress } = await import(
    pathToFileURL(path.join(output, "api/stress-analysis.js"))
  );
  assert.equal(
    (
      await stress.fetch(
        new Request("https://example.test/api/stress-analysis"),
      )
    ).status,
    405,
  );
  console.log("Native Node API smoke check passed.");
} finally {
  await rm(output, { recursive: true, force: true });
}
