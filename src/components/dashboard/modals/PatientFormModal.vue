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
        <div v-if="showPasswordStep" class="space-y-5">
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-full bg-green-100">
              <KeyRound class="w-5 h-5 text-green-600" />
            </div>
            <h2 class="font-display text-xl text-foreground">
              Paciente cadastrado!
            </h2>
          </div>

          <p class="font-body text-sm text-muted-foreground">
            Anote a senha temporária abaixo e entregue ao paciente. Ela
            <strong class="text-foreground">não será exibida novamente</strong>.
          </p>

          <div
            class="rounded-xl border border-amber-300 bg-amber-50 p-4 space-y-2"
          >
            <p
              class="font-body text-xs font-semibold text-amber-700 uppercase tracking-wide"
            >
              Senha temporária
            </p>
            <div class="flex items-center gap-3">
              <code
                class="font-mono text-2xl font-bold tracking-widest text-amber-900 select-all"
              >
                {{ generatedPassword }}
              </code>
              <button
                type="button"
                @click="copyPassword"
                class="ml-auto p-2 rounded-lg hover:bg-amber-100 transition"
                :title="copied ? 'Copiado!' : 'Copiar senha'"
              >
                <ClipboardCheck v-if="copied" class="w-4 h-4 text-green-600" />
                <Clipboard v-else class="w-4 h-4 text-amber-700" />
              </button>
            </div>
          </div>

          <p class="font-body text-xs text-muted-foreground">
            O paciente será obrigado a trocar esta senha no primeiro login.
          </p>

          <button
            type="button"
            @click="confirmPasswordCopied"
            class="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-body text-sm font-medium hover:bg-primary/90 transition"
          >
            Entendi, fechar
          </button>
        </div>

        <template v-else>
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
              <label class="font-body text-sm font-medium text-foreground">
                Tipo de agendamento
              </label>
              <select
                v-model="modalForm.schedule_type"
                class="w-full px-4 py-2.5 border border-border/60 rounded-lg text-sm font-body bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
              >
                <option value="regular">Semanal</option>
                <option value="extra">Avulso</option>
              </select>
            </div>

            <div v-if="modalForm.schedule_type === 'regular'" class="space-y-4">
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
            </div>

            <div v-if="modalForm.schedule_type === 'extra'" class="space-y-4">
              <div class="space-y-1.5">
                <label class="font-body text-sm font-medium text-foreground">
                  Data da sessão
                </label>
                <input
                  v-model="modalForm.single_date"
                  type="date"
                  class="w-full px-4 py-2.5 border border-border/60 rounded-lg text-sm font-body bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                />
              </div>
            </div>

            <div
              v-if="modalForm.schedule_type === 'regular'"
              class="space-y-1.5"
            >
              <label class="font-body text-sm font-medium text-foreground">
                Horário da sessão
              </label>
              <input
                v-model="modalForm.session_time"
                type="time"
                class="w-full px-4 py-2.5 border border-border/60 rounded-lg text-sm font-body bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
              />
            </div>

            <div v-if="modalForm.schedule_type === 'extra'" class="space-y-1.5">
              <label class="font-body text-sm font-medium text-foreground">
                Horário da sessão
              </label>
              <input
                v-model="modalForm.single_time"
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
        </template>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";
import { X, KeyRound, Clipboard, ClipboardCheck } from "lucide-vue-next";
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

const showPasswordStep = ref(false);
const generatedPassword = ref("");
const copied = ref(false);

const editingSessionId = ref<number | null>(null);

const modalForm = reactive({
  name: "",
  email: "",
  google_meet_link: "",
  schedule_type: "regular" as "regular" | "extra",
  sessions_per_week: 0,
  weekdays: [] as string[],
  session_time: "",
  single_date: "",
  single_time: "",
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
  modalForm.schedule_type = "regular";
  modalForm.single_date = "";
  modalForm.single_time = "";
  editingSessionId.value = null;
  showPasswordStep.value = false;
  generatedPassword.value = "";
  copied.value = false;
}

watch(
  () => props.isOpen,
  (newVal) => {
    if (!newVal) return;

    resetModal();

    if (!props.patientToEdit) return;

    const p = props.patientToEdit;

    modalForm.name = p.name;
    modalForm.email = p.email;
    modalForm.google_meet_link = p.google_meet_link ?? "";

    modalForm.schedule_type = (p.schedule_type ?? "regular") as
      | "regular"
      | "extra";

    if (p.schedule_type === "regular") {
      modalForm.sessions_per_week = p.sessions_per_week ?? 0;
      modalForm.weekdays = [...(p.session_days ?? [])];
      modalForm.session_time = p.session_time ?? "";
    }

    if (p.schedule_type === "extra") {
      const firstSession = p.extra_sessions?.[0];

      if (firstSession) {
        modalForm.single_date = firstSession.date ?? "";
        modalForm.single_time = firstSession.time ?? "";
        editingSessionId.value = firstSession.id;
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
    const payload: any = {
      name: modalForm.name.trim(),
      email: modalForm.email.trim(),
      google_meet_link: modalForm.google_meet_link.trim() || undefined,
      schedule_type: modalForm.schedule_type,
    };

    if (modalForm.schedule_type === "regular") {
      payload.sessions_per_week = modalForm.sessions_per_week || undefined;
      payload.weekdays =
        modalForm.weekdays.length > 0 ? modalForm.weekdays : undefined;
      payload.session_time = modalForm.session_time || undefined;
    }

    if (modalForm.schedule_type === "extra") {
      payload.single_date = modalForm.single_date || undefined;
      payload.single_time = modalForm.single_time || undefined;
      if (isEditing.value && editingSessionId.value) {
        payload.session_id = editingSessionId.value;
      }
    }

    if (isEditing.value && props.patientToEdit) {
      const updated = await updatePatient(props.patientToEdit.id, payload);
      emit("saved", updated, false);
      closeModal();
    } else {
      const created = await createPatient(payload);
      generatedPassword.value = created.generated_password;
      showPasswordStep.value = true;
      emit("saved", created, true);
    }
  } catch (err: any) {
    const msgs = err?.response?.data?.errors;
    modalError.value = Array.isArray(msgs)
      ? msgs.join(", ")
      : "Erro ao salvar paciente.";
  } finally {
    modalLoading.value = false;
  }
}

async function copyPassword() {
  try {
    await navigator.clipboard.writeText(generatedPassword.value);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  } catch {
    // implementar toast de erro aqui
  }
}

function confirmPasswordCopied() {
  emit("close");
}
</script>
