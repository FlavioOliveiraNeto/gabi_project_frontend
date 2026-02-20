<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      @click.self="closeModal"
    >
      <div
        class="bg-card rounded-2xl shadow-lg w-full max-w-lg p-6 overflow-y-auto max-h-[90vh]"
      >
        <div class="flex items-center justify-between mb-5">
          <h2 class="font-display text-xl text-foreground">
            {{ isEditing ? "Editar paciente" : "Adicionar paciente" }}
          </h2>
          <button
            @click="closeModal"
            class="p-1.5 rounded-lg hover:bg-muted transition"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="space-y-1.5">
            <label class="font-body text-sm font-medium text-foreground"
              >Nome completo *</label
            >
            <input
              v-model="modalForm.name"
              type="text"
              placeholder="Nome do paciente"
              class="w-full px-4 py-2.5 border border-border/60 rounded-lg text-sm font-body bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
              :class="{ 'border-destructive': modalErrors.name }"
            />
            <p
              v-if="modalErrors.name"
              class="text-xs text-destructive font-body"
            >
              {{ modalErrors.name }}
            </p>
          </div>

          <div class="space-y-1.5">
            <label class="font-body text-sm font-medium text-foreground"
              >E-mail *</label
            >
            <input
              v-model="modalForm.email"
              type="email"
              placeholder="paciente@email.com"
              class="w-full px-4 py-2.5 border border-border/60 rounded-lg text-sm font-body bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
              :class="{ 'border-destructive': modalErrors.email }"
            />
            <p
              v-if="modalErrors.email"
              class="text-xs text-destructive font-body"
            >
              {{ modalErrors.email }}
            </p>
          </div>

          <div class="space-y-1.5">
            <label class="font-body text-sm font-medium text-foreground"
              >Link do Google Meet</label
            >
            <input
              v-model="modalForm.google_meet_link"
              type="url"
              placeholder="https://meet.google.com/..."
              class="w-full px-4 py-2.5 border border-border/60 rounded-lg text-sm font-body bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
            />
          </div>

          <div class="space-y-1.5">
            <label class="font-body text-sm font-medium text-foreground"
              >Sessões por semana</label
            >
            <select
              v-model.number="modalForm.sessions_per_week"
              class="w-full px-4 py-2.5 border border-border/60 rounded-lg text-sm font-body bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
            >
              <option :value="0">Não definido</option>
              <option v-for="n in 7" :key="n" :value="n">
                {{ n }}x por semana
              </option>
            </select>
          </div>

          <div class="space-y-1.5">
            <label class="font-body text-sm font-medium text-foreground"
              >Dias das sessões</label
            >
            <div class="flex flex-wrap gap-3">
              <label
                v-for="(label, day) in WEEKDAY_LABELS"
                :key="day"
                class="flex items-center gap-1.5 cursor-pointer"
              >
                <input
                  type="checkbox"
                  :value="day"
                  v-model="modalForm.weekdays"
                  class="accent-primary w-4 h-4 cursor-pointer"
                />
                <span class="font-body text-sm">{{ label }}</span>
              </label>
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="font-body text-sm font-medium text-foreground"
              >Horário da sessão</label
            >
            <input
              v-model="modalForm.session_time"
              type="time"
              class="w-full px-4 py-2.5 border border-border/60 rounded-lg text-sm font-body bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
            />
          </div>

          <p
            v-if="modalError"
            class="text-sm text-destructive font-body text-center bg-destructive/10 rounded-lg py-2 px-3"
          >
            {{ modalError }}
          </p>

          <div class="flex gap-3 pt-2">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 py-2.5 rounded-lg border border-border/60 font-body text-sm font-medium hover:bg-muted transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="modalLoading"
              class="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground font-body text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition"
            >
              {{
                modalLoading
                  ? "Salvando..."
                  : isEditing
                    ? "Salvar alterações"
                    : "Cadastrar paciente"
              }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";
import { X } from "lucide-vue-next";
import {
  createPatient,
  updatePatient,
  type PatientUser,
} from "@/services/dashboard";

const props = defineProps<{
  isOpen: boolean;
  patientToEdit: PatientUser | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "saved", patient: PatientUser, isNew: boolean): void;
}>();

const WEEKDAY_LABELS: Record<string, string> = {
  sunday: "Dom",
  monday: "Seg",
  tuesday: "Ter",
  wednesday: "Qua",
  thursday: "Qui",
  friday: "Sex",
  saturday: "Sáb",
};

const isEditing = computed(() => !!props.patientToEdit);
const modalLoading = ref(false);
const modalError = ref("");
const modalErrors = reactive<Record<string, string>>({});

const modalForm = reactive({
  name: "",
  email: "",
  google_meet_link: "",
  sessions_per_week: 0,
  weekdays: [] as string[],
  session_time: "",
});

function resetModal() {
  modalForm.name = "";
  modalForm.email = "";
  modalForm.google_meet_link = "";
  modalForm.sessions_per_week = 0;
  modalForm.weekdays = [];
  modalForm.session_time = "";
  Object.keys(modalErrors).forEach((k) => delete modalErrors[k]);
  modalError.value = "";
  modalLoading.value = false;
}

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      resetModal();
      if (props.patientToEdit) {
        modalForm.name = props.patientToEdit.name;
        modalForm.email = props.patientToEdit.email;
        modalForm.google_meet_link = props.patientToEdit.google_meet_link ?? "";
        modalForm.sessions_per_week = props.patientToEdit.sessions_per_week;
        modalForm.weekdays = [...props.patientToEdit.session_days];
        modalForm.session_time = props.patientToEdit.session_time ?? "";
      }
    }
  },
);

function closeModal() {
  emit("close");
}

function validateModal(): boolean {
  Object.keys(modalErrors).forEach((k) => delete modalErrors[k]);
  if (!modalForm.name.trim()) modalErrors.name = "Nome é obrigatório.";
  if (!modalForm.email.trim()) modalErrors.email = "E-mail é obrigatório.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(modalForm.email))
    modalErrors.email = "E-mail inválido.";
  return Object.keys(modalErrors).length === 0;
}

async function handleSubmit() {
  if (!validateModal()) return;
  modalLoading.value = true;
  modalError.value = "";

  try {
    const payload = {
      name: modalForm.name.trim(),
      email: modalForm.email.trim(),
      google_meet_link: modalForm.google_meet_link.trim() || undefined,
      sessions_per_week: modalForm.sessions_per_week || undefined,
      weekdays: modalForm.weekdays.length > 0 ? modalForm.weekdays : undefined,
      session_time: modalForm.session_time || undefined,
    };

    if (isEditing.value && props.patientToEdit) {
      const updated = await updatePatient(props.patientToEdit.id, payload);
      emit("saved", updated, false);
    } else {
      const created = await createPatient(payload);
      emit("saved", created, true);
    }
    closeModal();
  } catch (err: any) {
    const msgs = err?.response?.data?.errors;
    modalError.value = Array.isArray(msgs)
      ? msgs.join(", ")
      : "Erro ao salvar paciente.";
  } finally {
    modalLoading.value = false;
  }
}
</script>
