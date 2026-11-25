import { describe, it, expect } from "vitest";
import { headTags } from "./head";
import { PAGES, pageFor } from "./pages";
import { FAQ_HOME, FAQ_PSICANALISE, faqJsonLd } from "./faq";

const FORBIDDEN = ["address", "streetAddress", "geo", "aggregateRating", "review", "priceRange", "price"];

function keysDeep(v: unknown): string[] {
  if (Array.isArray(v)) return v.flatMap(keysDeep);
  if (v && typeof v === "object") return Object.entries(v).flatMap(([k, x]) => [k, ...keysDeep(x)]);
  return [];
}

describe.each(Object.keys(PAGES))("page meta %s", (path) => {
  const tags = headTags(path);
  it("has a self-canonical, title <= 60 and description <= 155", () => {
    expect(tags).toContain(`<link rel="canonical" href="https://www.psigabriellafelix.com.br${path}" />`);
    expect(PAGES[path].title.length).toBeLessThanOrEqual(60);
    expect(PAGES[path].description.length).toBeLessThanOrEqual(155);
    expect(PAGES[path].title).toContain("Gabriella Felix - Psicóloga Clínica");
  });
});

describe("head tags", () => {
  const tags = headTags("/");
  const json = JSON.parse(tags.match(/<script type="application\/ld\+json">(.*)<\/script>/)![1]);

  it("uses the exact home title", () => {
    expect(PAGES["/"].title).toBe("Gabriella Felix - Psicóloga Clínica | Psicanálise online");
  });

  it("emits a self-referencing canonical", () => {
    expect(tags).toContain('<link rel="canonical" href="https://www.psigabriellafelix.com.br/" />');
  });

  it("emits valid ProfessionalService JSON-LD with required fields", () => {
    expect(json["@type"]).toBe("ProfessionalService");
    expect(json.knowsLanguage).toBe("pt-BR");
    expect(json.name).toBe("Gabriella Felix - Psicóloga Clínica");
    expect(json.telephone).toBe("+55 62 99619-5671");
    expect(json.sameAs).toEqual([
      "https://maps.google.com/?cid=9477565020376263146",
      "https://www.instagram.com/psi.gabriellafelix/",
    ]);
  });

  it("contains no forbidden fields", () => {
    const keys = keysDeep(json);
    for (const f of FORBIDDEN) expect(keys).not.toContain(f);
  });
});

const TYPE_ALLOWLIST = ["ProfessionalService", "FAQPage", "Question", "Answer", "City", "AdministrativeArea"];

function typesDeep(v: unknown): string[] {
  if (Array.isArray(v)) return v.flatMap(typesDeep);
  if (v && typeof v === "object")
    return Object.entries(v).flatMap(([k, x]) => (k === "@type" ? [String(x)] : typesDeep(x)));
  return [];
}

describe("all emitted JSON-LD", () => {
  const blocks = [
    ...Object.keys(PAGES).map((p) => JSON.parse(headTags(p).match(/<script type="application\/ld\+json">(.*)<\/script>/)![1])),
    faqJsonLd(FAQ_HOME),
    faqJsonLd(FAQ_PSICANALISE),
  ];

  it("only uses allowlisted schema.org types", () => {
    for (const t of typesDeep(blocks)) expect(TYPE_ALLOWLIST).toContain(t);
  });

  it("never emits Psychologist or availableLanguage", () => {
    const s = JSON.stringify(blocks);
    expect(s).not.toContain("Psychologist");
    expect(s).not.toContain("availableLanguage");
  });
});

describe("pageFor", () => {
  it.each([
    ["/psicanalise-online", "Psicanálise online | Gabriella Felix - Psicóloga Clínica"],
    ["/psicanalise-online/", "Psicanálise online | Gabriella Felix - Psicóloga Clínica"],
    ["/psicologia-questoes-raciais", "Questões raciais | Gabriella Felix - Psicóloga Clínica"],
    ["/psicologia-questoes-raciais/", "Questões raciais | Gabriella Felix - Psicóloga Clínica"],
    ["/", "Gabriella Felix - Psicóloga Clínica | Psicanálise online"],
  ])("resolves %s", (path, title) => {
    expect(pageFor(path)?.title).toBe(title);
  });

  it("returns undefined for unknown paths (router falls back to the home title)", () => {
    expect(pageFor("/login")).toBeUndefined();
  });

  it("keeps the canonical without trailing slash", () => {
    expect(headTags("/psicanalise-online/")).toContain(
      '<link rel="canonical" href="https://www.psigabriellafelix.com.br/psicanalise-online" />',
    );
  });
});
