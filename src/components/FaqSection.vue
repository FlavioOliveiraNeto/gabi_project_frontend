<template>
  <section
    :aria-labelledby="headingId"
    class="py-12"
  >
    <h2
      :id="headingId"
      class="text-3xl md:text-4xl font-display font-bold text-foreground mb-6"
    >
      {{ title }}
    </h2>
    <div class="space-y-3">
      <details
        v-for="item in items"
        :key="item.q"
        class="group rounded-2xl border border-border bg-card px-5 py-4"
      >
        <summary
          class="cursor-pointer list-none font-display font-semibold text-foreground flex justify-between gap-4 rounded focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4"
        >
          {{ item.q }}
          <span
            aria-hidden="true"
            class="text-primary transition-transform group-open:rotate-45"
          >+</span>
        </summary>
        <p class="font-body text-muted-foreground mt-3 leading-relaxed">
          {{ item.a }}
        </p>
      </details>
    </div>
    <!-- Same data as the visible accordion, so schema and text cannot diverge. -->
    <JsonLd :data="faqJsonLd(items)" />
  </section>
</template>

<script setup lang="ts">
import { h } from "vue";
import { faqJsonLd, jsonLdString, type FaqItem } from "@/seo/faq";

// Raw JSON inside <script> (text interpolation would HTML-escape the quotes).
const JsonLd = (p: { data: unknown }) =>
  h("script", { type: "application/ld+json", innerHTML: jsonLdString(p.data) });
JsonLd.props = ["data"];

withDefaults(defineProps<{ items: FaqItem[]; title?: string; headingId?: string }>(), {
  title: "Perguntas frequentes",
  headingId: "faq",
});
</script>
