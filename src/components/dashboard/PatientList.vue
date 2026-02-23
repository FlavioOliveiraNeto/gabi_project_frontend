<template>
  <div class="border border-border/50 rounded-xl p-6 bg-card">
    <div class="flex items-center gap-3 mb-5 flex-wrap">
      <FileText class="w-5 h-5 text-primary" />
      <h3 class="font-display text-xl text-foreground">Pacientes</h3>
      <span
        class="ml-auto font-body text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full"
      >
        {{ props.patients?.length ?? 0 }} cadastrado{{
          props.patients?.length !== 1 ? "s" : ""
        }}
      </span>
      <button
        @click="$emit('add')"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-body text-sm font-medium hover:bg-primary/90 transition"
      >
        <Plus class="w-4 h-4" /> Adicionar paciente
      </button>
    </div>

    <div class="relative mb-4">
      <Search
        class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
      <input
        v-model="patientSearch"
        type="text"
        placeholder="Buscar paciente..."
        class="w-full pl-9 pr-4 py-2.5 text-sm font-body border border-border/50 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
      />
    </div>

    <div v-if="isLoading" class="text-center py-10">
      <p class="font-body text-sm text-muted-foreground">
        Carregando pacientes...
      </p>
    </div>

    <div v-else-if="filteredPatients.length === 0" class="text-center py-10">
      <p class="font-body text-sm text-muted-foreground">
        {{
          patientSearch
            ? "Nenhum paciente encontrado."
            : "Nenhum paciente cadastrado ainda."
        }}
      </p>
    </div>

    <div v-else class="space-y-2">
      <div
        v-if="totalPages > 1"
        class="flex justify-end items-center gap-1 ml-auto"
      >
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="p-1.5 hover:bg-muted rounded-lg transition"
        >
          <ChevronLeft class="w-4 h-4 text-muted-foreground" />
        </button>
        <span class="text-xs font-body"
          >{{ currentPage }} / {{ totalPages }}</span
        >
        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="p-1.5 hover:bg-muted rounded-lg transition"
        >
          <ChevronRight class="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <PatientCard
        v-for="patient in paginatedPatients"
        :key="patient.id"
        :patient="patient"
        :is-open="selectedPatient === patient.id"
        @toggle-notes="togglePatient(patient.id)"
        @edit="$emit('edit', patient)"
        @delete="$emit('delete', patient)"
        @note-saved="handleNoteSaved"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Plus,
  Search,
} from "lucide-vue-next";
import PatientCard from "./PatientCard.vue";
import type { PatientUser } from "@/services/dashboard";

const props = defineProps<{
  patients: PatientUser[];
  isLoading: boolean;
}>();

const emit = defineEmits<{
  (e: "add"): void;
  (e: "edit", patient: PatientUser): void;
  (e: "delete", patient: PatientUser): void;
  (e: "note-saved", patientId: number, note: any): void;
}>();

const patientSearch = ref("");
const selectedPatient = ref<number | null>(null);
const currentPage = ref(1);
const perPage = 5;

const filteredPatients = computed(() => {
  const q = patientSearch.value.toLowerCase().trim();
  const sorted = [...props.patients].sort((a, b) =>
    a.name.localeCompare(b.name, "pt-BR"),
  );
  if (!q) return sorted;
  return sorted.filter((p) => p.name.toLowerCase().includes(q));
});

const paginatedPatients = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return filteredPatients.value.slice(start, start + perPage);
});

const totalPages = computed(
  () => Math.ceil(filteredPatients.value.length / perPage) || 1,
);

function togglePatient(id: number) {
  selectedPatient.value = selectedPatient.value === id ? null : id;
}

function handleNoteSaved(patientId: number, note: any) {
  emit("note-saved", patientId, note);
}
</script>
