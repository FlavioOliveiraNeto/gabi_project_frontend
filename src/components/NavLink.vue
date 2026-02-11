<template>
  <RouterLink
    :to="to"
    custom
    v-slot="{ href, navigate, isActive, isExactActive }"
  >
    <a
      :href="href"
      @click="navigate"
      :class="computedClass(isActive || isExactActive)"
    >
      <slot />
    </a>
  </RouterLink>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import { computed } from "vue";

interface Props {
  to: string;
  class?: string;
  activeClassName?: string;
}

const props = defineProps<Props>();

function computedClass(isActive: boolean) {
  return [props.class, isActive && props.activeClassName];
}
</script>
