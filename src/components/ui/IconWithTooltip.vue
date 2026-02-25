<template>
  <div class="relative group inline-flex">
    <slot />
    <div
      class="absolute top-full hidden group-hover:block whitespace-nowrap bg-foreground text-background text-xs px-2 py-1 rounded-md shadow-lg"
    >
      {{ text }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text: string;
}>();
</script>
