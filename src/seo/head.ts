import { SITE } from "./site";

export function psychologistJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Psychologist",
    name: SITE.name,
    url: `${SITE.url}/`,
    telephone: SITE.phoneSchema,
    email: SITE.email,
    areaServed: [
      { "@type": "City", name: "Goiânia" },
      { "@type": "AdministrativeArea", name: "Goiás" },
    ],
    availableLanguage: "pt-BR",
    sameAs: [SITE.googleBusinessProfile, SITE.instagram],
  };
}

// Extra <head> tags injected at build time by scripts/prerender.mjs.
export function headTags(path: string): string {
  const url = `${SITE.url}${path}`;
  // "<" escaped so the JSON can never close the <script> tag.
  const json = JSON.stringify(psychologistJsonLd()).replace(/</g, "\\u003c");
  return [
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<script type="application/ld+json">${json}</script>`,
  ].join("\n    ");
}
