import { describe, it, expect } from "vitest";
import { createSSRApp, h } from "vue";
import { renderToString } from "vue/server-renderer";
import FaqSection from "../FaqSection.vue";
import { FAQ_HOME, FAQ_PSICANALISE } from "@/seo/faq";

const FORBIDDEN = /"(address|streetAddress|geo|aggregateRating|review|priceRange|price)"\s*:/;

describe.each([
  ["home", FAQ_HOME],
  ["psicanalise", FAQ_PSICANALISE],
])("FaqSection (%s)", (_, items) => {
  it("emits FAQPage JSON-LD matching the visible text", async () => {
    const html = await renderToString(createSSRApp({ render: () => h(FaqSection, { items }) }));
    const doc = new DOMParser().parseFromString(html, "text/html");
    const raw = doc.querySelector('script[type="application/ld+json"]')!.textContent!;
    expect(raw).not.toMatch(FORBIDDEN);
    const json = JSON.parse(raw);
    expect(json["@type"]).toBe("FAQPage");
    expect(json.mainEntity).toHaveLength(items.length);

    const summaries = [...doc.querySelectorAll("summary")].map((s) => s.firstChild!.textContent!.trim());
    const answers = [...doc.querySelectorAll("details p")].map((p) => p.textContent!.trim());
    json.mainEntity.forEach((e: { name: string; acceptedAnswer: { text: string } }, i: number) => {
      expect(summaries[i]).toBe(e.name);
      expect(answers[i]).toBe(e.acceptedAnswer.text);
    });
  });
});
