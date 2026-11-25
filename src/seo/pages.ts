import { SITE } from "./site";

export interface PageMeta {
  title: string;
  description: string;
}

// Indexable, prerendered pages. Keys are route paths.
export const PAGES: Record<string, PageMeta> = {
  "/": {
    title: `${SITE.name} | Psicanálise online`,
    description:
      "Psicanálise online com Gabriella Felix, psicóloga clínica e psicanalista em Goiânia, GO. Atendimento por videochamada. CRP 09/21105.",
  },
  "/psicanalise-online": {
    title: `Psicanálise online | ${SITE.name}`,
    description:
      "Psicoterapia psicanalítica online, por videochamada, com Gabriella Felix, psicóloga clínica e psicanalista em Goiânia, GO. CRP 09/21105.",
  },
  "/psicologia-questoes-raciais": {
    title: `Questões raciais | ${SITE.name}`,
    description:
      "Escuta clínica atenta a atravessamentos sociais, raciais e de gênero. Atendimento online com Gabriella Felix, psicóloga clínica. CRP 09/21105.",
  },
};

// Vue Router matches paths case-insensitively and with an optional trailing slash
// (its defaults), so the head lookup does the same: "/Psicanalise-Online/" → "/psicanalise-online".
export function normalizePath(path: string): string {
  const p = path.toLowerCase();
  return p.length > 1 ? p.replace(/\/+$/, "") : p;
}

export function pageFor(path: string): PageMeta | undefined {
  return PAGES[normalizePath(path)];
}
