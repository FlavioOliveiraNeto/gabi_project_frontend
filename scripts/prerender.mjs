// Pré-renderiza as páginas públicas indexáveis (PAGES em src/seo/pages.ts) em dist/,
// com <head> próprio. dist/app.html fica com o shell vazio e atende as demais rotas (ver vercel.json / nginx.conf).
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");

const shell = await readFile(path.join(dist, "index.html"), "utf8");
const placeholder = '<div id="app"></div>';
if (!shell.includes(placeholder)) throw new Error(`prerender: ${placeholder} não encontrado em dist/index.html`);

// Tags que cada página define por conta própria (headTags).
const perPage = [
  /<title>[\s\S]*?<\/title>\s*/,
  /<meta\s+name="description"[\s\S]*?\/>\s*/,
  /<meta\s+property="og:title"[\s\S]*?\/>\s*/,
  /<meta\s+property="og:description"[\s\S]*?\/>\s*/,
];
const baseShell = perPage.reduce((s, re) => {
  if (!re.test(s)) throw new Error(`prerender: ${re} não encontrado no shell`);
  return s.replace(re, "");
}, shell);

const { render, headTags, PAGES } = await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href);

await writeFile(path.join(dist, "app.html"), shell);
for (const url of Object.keys(PAGES)) {
  const html = await render(url);
  const page = baseShell
    .replace(placeholder, `<div id="app">${html}</div>`)
    .replace("</head>", `  ${headTags(url)}\n  </head>`);
  const dir = path.join(dist, url);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "index.html"), page);
  console.log(`prerender: ${url} → ${path.relative(root, path.join(dir, "index.html"))} (${html.length} bytes de HTML)`);
}
await rm(ssrDir, { recursive: true, force: true });
