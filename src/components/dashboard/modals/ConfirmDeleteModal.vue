<template>
  <Teleport to="body">
    <div
      v-if="isOpen && target"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      @click.self="closeModal"
    >
      <div class="bg-card rounded-2xl shadow-lg w-full max-w-sm p-6">
        <h2 class="font-display text-lg text-foreground mb-2">
          Excluir paciente
        </h2>
        <p class="font-body text-sm text-muted-foreground mb-6">
          Tem certeza que deseja excluir
          <strong class="text-foreground">{{ target.name }}</strong
          >? Todas as anotações e sessões serão removidas permanentemente.
        </p>
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
            {{ isLoading ? "Excluindo..." : "Excluir" }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { deletePatient, type PatientUser } from "@/services/dashboard";

const props = defineProps<{
  isOpen: boolean;
  target: PatientUser | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "deleted", patientId: number): void;
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
    await deletePatient(props.target.id);
    emit("deleted", props.target.id);
    closeModal();
  } catch {
    // Tratar erro
  } finally {
    isLoading.value = false;
    closeModal();
  }
}
</script>
