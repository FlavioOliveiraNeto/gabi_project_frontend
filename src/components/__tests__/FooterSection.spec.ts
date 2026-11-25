import { describe, it, expect } from "vitest";
import { createSSRApp } from "vue";
import { renderToString } from "vue/server-renderer";
import FooterSection from "../FooterSection.vue";

describe("FooterSection NAP", () => {
  it("renders the NAP block in the required order", async () => {
    const html = await renderToString(createSSRApp(FooterSection));
    const doc = new DOMParser().parseFromString(html, "text/html");
    const nap = doc.querySelector('[data-testid="nap"]')!;
    const lines = [...nap.querySelectorAll("p")].map((p) => p.textContent?.trim());
    expect(lines).toEqual([
      "Gabriella Felix - Psicóloga Clínica",
      "(62) 99619-5671",
      "Atendimento online — Goiânia, GO",
      "CRP 09/21105",
      "gabrielafelixsilva@gmail.com",
    ]);
    expect(nap.querySelector('a[href^="tel:"]')?.getAttribute("href")).toBe("tel:+5562996195671");
    expect(nap.querySelector('a[href^="mailto:"]')?.getAttribute("href")).toBe("mailto:gabrielafelixsilva@gmail.com");
  });
});
