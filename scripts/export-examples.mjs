import { createServer } from "vite";
import { writeFile, readFile } from "node:fs/promises";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
const server = await createServer({
  server: { middlewareMode: true, hmr: false, ws: false },
  appType: "custom",
});
try {
  const { examples } = await server.ssrLoadModule("/src/fixtures/examples.ts");
  const { reportMarkdown } = await server.ssrLoadModule(
    "/src/import-export/report.ts",
  );
  const { serialize, parseImport } = await server.ssrLoadModule(
    "/src/import-export/exchange.ts",
  );
  const { Report } = await server.ssrLoadModule("/src/features/Report.tsx");
  const data = examples();
  parseImport(serialize(data));
  await writeFile("examples/Beispielfaelle.json", serialize(data));
  await writeFile("examples/Musterbericht.md", reportMarkdown(data[1]));
  const markup = renderToStaticMarkup(createElement(Report, { a: data[1] }));
  const article = markup.slice(markup.indexOf("<article"));
  const css = await readFile("src/styles.css", "utf8");
  await writeFile(
    "examples/Musterbericht.html",
    `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Fiktiver Musterbericht</title><style>${css}</style></head><body><main class="main report-main">${article}</main></body></html>`,
  );
  console.log(
    "Drei validierte Beispieldateien und vollständiger fiktiver Musterbericht exportiert.",
  );
} finally {
  await server.close();
}
