<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      @click.self="closeModal"
    >
      <div class="bg-card rounded-2xl shadow-lg w-full max-w-sm p-6">
        <p class="font-body text-base text-muted-foreground mb-6">
          Adicionar sessão
        </p>

        <p class="font-body text-sm text-muted-foreground mb-6">
          Criar sessão para o dia
          <strong class="text-foreground">
            {{ format(date, "EEEE, dd 'de' MMMM", { locale: ptBR }) }}
          </strong>
        </p>

        <div class="mb-4 relative" ref="dropdownRef">
          <label class="text-sm font-medium text-muted-foreground mb-1 block">
            Paciente
          </label>

          <div
            @click="toggleDropdown"
            :class="[
              'w-full rounded-xl px-3 py-2 text-sm bg-background flex items-center justify-between cursor-pointer transition-all duration-150',
              isDropdownOpen
                ? 'border border-primary ring-2 ring-primary/20'
                : 'border border-border hover:border-primary',
            ]"
          >
            <span v-if="selectedPatient" class="flex items-center gap-2">
              <div
                class="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center"
              >
                {{ initials(selectedPatient.name) }}
              </div>
              {{ selectedPatient.name }}
            </span>

            <span v-else class="text-muted-foreground">
              Selecione um paciente
            </span>

            <ChevronDown
              class="w-4 h-4 text-muted-foreground transition-transform duration-200"
              :class="{ 'rotate-180': isDropdownOpen }"
            />
          </div>

          <div
            v-if="isDropdownOpen"
            class="absolute z-50 mt-2 w-full bg-card border border-border rounded-xl shadow-lg overflow-hidden animate-fade-in"
          >
            <div class="p-2 border-b border-border">
              <input
                v-model="search"
                type="text"
                placeholder="Buscar paciente..."
                class="w-full px-2 py-1.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div class="max-h-48 overflow-y-auto custom-scroll">
              <div
                v-for="patient in filteredPatients"
                :key="patient.id"
                @click="selectPatient(patient)"
                class="flex items-center gap-3 px-3 py-2 text-sm cursor-pointer hover:bg-muted transition"
              >
                <div
                  class="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center"
                >
                  {{ initials(patient.name) }}
                </div>
                <span>{{ patient.name }}</span>
              </div>

              <div
                v-if="filteredPatients.length === 0"
                class="px-3 py-3 text-sm text-muted-foreground text-center"
              >
                Nenhum paciente encontrado
              </div>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <label class="text-sm font-medium text-muted-foreground mb-1 block">
            Horário
          </label>
          <input
            type="time"
            v-model="selectedTime"
            class="w-full border border-border rounded-lg p-2 text-sm bg-background focus:ring-1 focus:ring-primary focus:outline-none"
          />
        </div>

        <p
          v-if="errorMessage"
          class="text-sm text-destructive font-body text-center bg-destructive/10 rounded-lg py-2 px-3 mb-4"
        >
          {{ errorMessage }}
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
            :disabled="isLoading || !selectedPatientId || !selectedTime"
            class="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground font-body text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {{ isLoading ? "Criando..." : "Criar sessão" }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount } from "vue";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronDown } from "lucide-vue-next";
import {
  createSession,
  type PatientUser,
  type CalendarSession,
} from "@/services/dashboard";

const props = defineProps<{
  isOpen: boolean;
  date: Date;
  patients: PatientUser[];
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "created", session: CalendarSession): void;
}>();

const selectedPatientId = ref<number | "">("");
const selectedTime = ref<string>("");
const isLoading = ref(false);
const errorMessage = ref("");

const isDropdownOpen = ref(false);
const search = ref("");
const dropdownRef = ref<HTMLElement | null>(null);

const filteredPatients = computed(() => {
  if (!search.value) return props.patients;
  return props.patients.filter((p) =>
    p.name.toLowerCase().includes(search.value.toLowerCase()),
  );
});

const selectedPatient = computed(() =>
  props.patients.find((p) => p.id === selectedPatientId.value),
);

watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      selectedPatientId.value = "";
      selectedTime.value = "";
      search.value = "";
      isLoading.value = false;
      isDropdownOpen.value = false;
      errorMessage.value = "";
    }
  },
);

function handleClickOutside(event: MouseEvent) {
  if (!dropdownRef.value) return;
  if (!dropdownRef.value.contains(event.target as Node)) {
    isDropdownOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

function closeModal() {
  if (!isLoading.value) emit("close");
}

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}

function selectPatient(patient: PatientUser) {
  selectedPatientId.value = patient.id;
  isDropdownOpen.value = false;
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

async function handleConfirm() {
  if (!selectedPatientId.value || !selectedTime.value) return;

  isLoading.value = true;
  errorMessage.value = "";

  try {
    const [hours, minutes] = selectedTime.value.split(":").map(Number);
    const sessionDate = new Date(props.date);
    sessionDate.setHours(hours, minutes, 0, 0);
    const scheduled_at = format(sessionDate, "yyyy-MM-dd HH:mm:ss");

    const session = await createSession({
      patient_id: Number(selectedPatientId.value),
      scheduled_at,
      session_type: "extra",
    });

    emit("created", session);
    isLoading.value = false;
    closeModal();
  } catch (err: any) {
    const msgs = err?.response?.data?.errors;
    errorMessage.value = Array.isArray(msgs)
      ? msgs.join(", ")
      : "Erro ao criar sessão. Verifique o horário e tente novamente.";
  } finally {
    isLoading.value = false;
  }
}
</script>
