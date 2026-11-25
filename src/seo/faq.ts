// Approved FAQ answers — verbatim from the professional. Do not edit wording.
export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ_HOME: FaqItem[] = [
  {
    q: "Quanto dura a sessão?",
    a: "Cada sessão tem 50 minutos. A frequência mais comum é semanal, definida junto com você na primeira conversa. Os horários disponíveis vão de segunda a sexta, das 8h às 22h, e aos sábados das 8h às 15h.",
  },
  {
    q: "Atende por plano de saúde?",
    a: "Não há atendimento por convênio. O pagamento é particular, e é emitido recibo com o CRP para que você possa solicitar reembolso ao seu plano de saúde ou usar na declaração de imposto de renda.",
  },
  {
    q: "Atende fora de Goiás?",
    a: "Sim. Como o atendimento é online, há pacientes de qualquer cidade do Brasil. Boa parte está em Goiânia e região, mas não há restrição geográfica.",
  },
];

export const FAQ_PSICANALISE: FaqItem[] = [
  {
    q: "Como funciona a terapia online?",
    a: "O atendimento é por videochamada, em horário marcado, de qualquer lugar em que você tenha conexão e um ambiente reservado. A sessão dura 50 minutos e segue o mesmo enquadramento de um atendimento presencial, com o mesmo sigilo profissional previsto no Código de Ética do psicólogo.",
  },
  {
    q: "Qual a abordagem?",
    a: "O trabalho é em psicanálise: um espaço de escuta em que você fala livremente e o sentido do que aparece vai sendo construído no seu tempo — não é um protocolo de tarefas nem um número fechado de sessões. Gabriella Felix é psicóloga clínica e psicanalista, CRP 09/21105.",
  },
];

export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

// Safe to inline in <script>: "<" escaped so the JSON can never close the tag.
export const jsonLdString = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
