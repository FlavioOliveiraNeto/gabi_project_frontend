// Pré-renderiza a landing (/) em dist/index.html para que o conteúdo pinte sem esperar o JS.
// dist/app.html fica com o shell vazio e atende as demais rotas (ver vercel.json / nginx.conf).
import { readFile, writeFile, rm } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");

const shell = await readFile(path.join(dist, "index.html"), "utf8");
const placeholder = '<div id="app"></div>';
if (!shell.includes(placeholder)) throw new Error(`prerender: ${placeholder} não encontrado em dist/index.html`);

const { render } = await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href);
const html = await render("/");

await writeFile(path.join(dist, "app.html"), shell);
await writeFile(path.join(dist, "index.html"), shell.replace(placeholder, `<div id="app">${html}</div>`));
await rm(ssrDir, { recursive: true, force: true });

console.log(`prerender: / → dist/index.html (${html.length} bytes de HTML), shell → dist/app.html`);
