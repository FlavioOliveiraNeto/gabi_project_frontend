import { SITE } from "./site";
import { normalizePath, pageFor } from "./pages";
import { jsonLdString } from "./faq";

export function businessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: SITE.name,
    url: `${SITE.url}/`,
    telephone: SITE.phoneSchema,
    email: SITE.email,
    areaServed: [
      { "@type": "City", name: "Goiânia" },
      { "@type": "AdministrativeArea", name: "Goiás" },
    ],
    knowsLanguage: "pt-BR",
    sameAs: [SITE.googleBusinessProfile, SITE.instagram],
  };
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

// Per-page <head> tags injected at build time by scripts/prerender.mjs.
// The shell's own <title>/description/og:title/og:description are stripped there.
export function headTags(path: string): string {
  const page = pageFor(path);
  if (!page) throw new Error(`headTags: no page meta for ${path}`);
  const url = `${SITE.url}${normalizePath(path)}`;
  const t = esc(page.title);
  const d = esc(page.description);
  return [
    `<title>${t}</title>`,
    `<meta name="description" content="${d}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:title" content="${t}" />`,
    `<meta property="og:description" content="${d}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${t}" />`,
    `<meta name="twitter:description" content="${d}" />`,
    `<script type="application/ld+json">${jsonLdString(businessJsonLd())}</script>`,
  ].join("\n    ");
}
