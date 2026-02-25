<template>
  <Teleport to="body">
    <div
      v-if="isOpen && target"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      @click.self="closeModal"
    >
      <div class="bg-card rounded-2xl shadow-lg w-full max-w-sm p-6">
        <p class="font-body text-base text-muted-foreground mb-6">
          Tem certeza que deseja marcar esta falta?
        </p>
        <div class="flex flex-col gap-2 mb-4">
          <p class="font-bold">Dados da sessão:</p>
          <p class="ml-4">Paciente: {{ target.patient?.name }}</p>
          <p class="ml-4">Data: {{ target.date }}</p>
          <p class="ml-4">Horário: {{ target.time }}</p>
        </div>
        <div class="flex gap-3">
          <button
            @click="closeModal"
            class="flex-1 py-2.5 rounded-lg border border-border/60 font-body text-sm font-medium hover:bg-muted transition"
          >
            Cancelar
          </button>
          <button
            @click="handleConfirm"
            :disabled="isLoading"
            class="flex-1 py-2.5 rounded-lg bg-destructive text-destructive-foreground font-body text-sm font-medium hover:bg-destructive/90 disabled:opacity-50 transition"
          >
            {{ isLoading ? "Marcando falta..." : "Marcar falta" }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { CalendarSession } from "@/services/dashboard";

const props = defineProps<{
  isOpen: boolean;
  target: CalendarSession | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "absent", sessionId: number): void;
}>();

const isLoading = ref(false);

function closeModal() {
  if (!isLoading.value) {
    emit("close");
  }
}

async function handleConfirm() {
  if (!props.target) return;
  isLoading.value = true;
  try {
    emit("absent", props.target.id);
    closeModal();
  } catch {
    // implementar toast de erro aqui
  } finally {
    isLoading.value = false;
  }
}
</script>
