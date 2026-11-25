import { describe, it, expect } from "vitest";
import { headTags } from "./head";
import { PAGES } from "./pages";

const FORBIDDEN = ["address", "streetAddress", "geo", "aggregateRating", "review", "priceRange", "price"];

function keysDeep(v: unknown): string[] {
  if (Array.isArray(v)) return v.flatMap(keysDeep);
  if (v && typeof v === "object") return Object.entries(v).flatMap(([k, x]) => [k, ...keysDeep(x)]);
  return [];
}

describe.each(Object.keys(PAGES))("page meta %s", (path) => {
  const tags = headTags(path);
  it("has a self-canonical, title <= 60 (except home, fixed by spec) and description <= 155", () => {
    expect(tags).toContain(`<link rel="canonical" href="https://www.psigabriellafelix.com.br${path}" />`);
    if (path !== "/") expect(PAGES[path].title.length).toBeLessThanOrEqual(60);
    expect(PAGES[path].description.length).toBeLessThanOrEqual(155);
    expect(PAGES[path].title).toContain("Gabriella Felix - Psicóloga Clínica");
  });
});

describe("head tags", () => {
  const tags = headTags("/");
  const json = JSON.parse(tags.match(/<script type="application\/ld\+json">(.*)<\/script>/)![1]);

  it("emits a self-referencing canonical", () => {
    expect(tags).toContain('<link rel="canonical" href="https://www.psigabriellafelix.com.br/" />');
  });

  it("emits valid Psychologist JSON-LD with required fields", () => {
    expect(json["@type"]).toBe("Psychologist");
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
