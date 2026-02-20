<template>
  <div
    class="border border-border/30 rounded-xl p-4 hover:border-border/60 transition"
  >
    <div class="flex items-start gap-3 flex-wrap">
      <div
        class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-body text-sm font-semibold text-primary shrink-0"
      >
        {{ initials(patient.name) }}
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <p class="font-body font-semibold text-sm text-foreground">
            {{ patient.name }}
          </p>
          <p class="font-body text-xs text-muted-foreground">
            {{ patient.email }}
          </p>
        </div>

        <div class="flex flex-wrap gap-1.5 mt-2">
          <span
            v-for="day in patient.session_days"
            :key="day"
            class="font-body text-xs px-2 py-0.5 rounded bg-secondary/10 text-secondary font-medium"
          >
            {{ WEEKDAY_LABELS[day] ?? day }}
          </span>
          <span
            v-if="patient.sessions_per_week > 0"
            class="font-body text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground"
          >
            {{ patient.sessions_per_week }}x/semana
          </span>
          <span
            v-if="patient.session_time"
            class="font-body text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground"
          >
            {{ patient.session_time }}
          </span>
        </div>

        <div class="flex flex-wrap gap-4 mt-3">
          <div class="flex items-center gap-1.5">
            <CheckCircle class="w-3.5 h-3.5 text-green-600" />
            <span class="font-body text-xs text-muted-foreground">
              {{ patient.completed_sessions }} realizadas
            </span>
          </div>
          <div
            class="flex items-center gap-1.5"
            :class="
              patient.absent_sessions > 0
                ? 'text-amber-500'
                : 'text-muted-foreground'
            "
          >
            <AlertCircle class="w-3.5 h-3.5" />
            <span class="font-body text-xs">
              {{ patient.absent_sessions }} falta{{
                patient.absent_sessions !== 1 ? "s" : ""
              }}
            </span>
          </div>
          <a
            v-if="patient.google_meet_link"
            :href="patient.google_meet_link"
            target="_blank"
            class="flex items-center gap-1 text-xs font-body font-medium text-secondary hover:underline"
          >
            <Video class="w-3.5 h-3.5" /> Google Meet
          </a>
          <span v-else class="font-body text-xs text-muted-foreground italic">
            Sem link de Meet
          </span>
        </div>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <button
          @click="$emit('toggle-notes')"
          class="p-1.5 rounded-lg hover:bg-muted transition"
          :title="isOpen ? 'Fechar anotações' : 'Ver anotações'"
        >
          <FileText class="w-4 h-4 text-muted-foreground" />
        </button>
        <button
          @click="$emit('edit', patient)"
          class="p-1.5 rounded-lg hover:bg-muted transition"
          title="Editar paciente"
        >
          <Pencil class="w-4 h-4 text-muted-foreground" />
        </button>
        <button
          @click="$emit('delete', patient)"
          class="p-1.5 rounded-lg hover:bg-destructive/10 transition"
          title="Excluir paciente"
        >
          <Trash2 class="w-4 h-4 text-destructive" />
        </button>
      </div>
    </div>

    <div v-if="isOpen" class="mt-4 border-t border-border/30 pt-4">
      <p
        class="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3"
      >
        Anotações clínicas (visíveis apenas para você)
      </p>

      <div class="mb-3">
        <textarea
          v-model="newNote"
          placeholder="Nova anotação clínica..."
          rows="3"
          class="w-full text-sm font-body border border-border/50 rounded-lg p-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none transition"
        ></textarea>
        <button
          @click="saveNote"
          :disabled="!newNote.trim() || savingNote"
          class="mt-2 flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-body text-sm font-medium hover:bg-primary/90 disabled:opacity-40 transition"
        >
          <Save class="w-3.5 h-3.5" />
          {{ savingNote ? "Salvando..." : "Salvar anotação" }}
        </button>
      </div>

      <div v-if="patient.clinical_notes.length > 0" class="space-y-2">
        <div
          v-for="note in patient.clinical_notes"
          :key="note.id"
          class="border border-border/20 rounded-lg p-3"
        >
          <div class="flex items-center gap-1.5 mb-1.5">
            <Clock4 class="w-3 h-3 text-muted-foreground" />
            <span class="font-body text-xs text-muted-foreground">
              {{ formatDate(note.created_at) }}
            </span>
          </div>
          <p class="font-body text-sm text-foreground leading-relaxed">
            {{ note.content }}
          </p>
        </div>
      </div>
      <div v-else class="text-center py-4">
        <p class="font-body text-xs text-muted-foreground">
          Nenhuma anotação ainda.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import {
  CheckCircle,
  AlertCircle,
  Video,
  FileText,
  Pencil,
  Trash2,
  Save,
  Clock4,
} from "lucide-vue-next";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { createClinicalNote, type PatientUser } from "@/services/dashboard";

const props = defineProps<{
  patient: PatientUser;
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "toggle-notes"): void;
  (e: "edit", patient: PatientUser): void;
  (e: "delete", patient: PatientUser): void;
  (e: "note-saved", patientId: number, note: any): void;
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

const newNote = ref("");
const savingNote = ref(false);

watch(
  () => props.isOpen,
  () => {
    newNote.value = "";
  },
);

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function formatDate(iso: string): string {
  try {
    return format(parseISO(iso), "dd MMM. yyyy", { locale: ptBR });
  } catch {
    return iso;
  }
}

async function saveNote() {
  const text = newNote.value.trim();
  if (!text || savingNote.value) return;

  savingNote.value = true;
  try {
    const note = await createClinicalNote(props.patient.id, text);
    emit("note-saved", props.patient.id, note);
    newNote.value = "";
  } catch {
    // Tratar erro se necessário
  } finally {
    savingNote.value = false;
  }
}
</script>
