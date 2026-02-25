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
            v-if="patient.schedule_type"
            class="font-body text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground"
          >
            {{
              patient.schedule_type === "regular"
                ? "Agendamento semanal"
                : "Agendamento avulso"
            }}
          </span>
          <span
            v-if="
              patient.sessions_per_week > 0 &&
              patient.schedule_type === 'regular'
            "
            class="font-body text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground"
          >
            {{ patient.sessions_per_week }}x/semana
          </span>
          <!-- BADGE AVULSO COM TOOLTIP -->
          <div
            v-else-if="patient.schedule_type === 'extra'"
            class="relative group inline-block"
          >
            <span
              class="font-body text-xs px-2 py-0.5 rounded bg-secondary/10 text-secondary font-medium cursor-pointer"
            >
              {{ (patient.extra_sessions ?? []).length }}
              {{
                (patient.extra_sessions ?? []).length > 1
                  ? "sessões agendadas"
                  : "sessão agendada"
              }}
            </span>

            <!-- Tooltip -->
            <div
              class="absolute left-1/2 -translate-x-1/2 mt-2 w-max max-w-xs opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 bg-card border border-border rounded-lg shadow-lg p-3 z-50"
            >
              <div
                v-for="s in patient.extra_sessions ?? []"
                :key="s.id"
                class="text-xs font-body text-foreground whitespace-nowrap flex items-center gap-2"
              >
                <span>{{ formatSingleDate(s.date) }}</span>
                <span>às</span>
                <span>{{ s.time }}</span>
                <span class="text-muted-foreground">
                  ({{ statusLabel(s.status) }})
                </span>
              </div>
            </div>
          </div>
          <span
            v-if="patient.schedule_type === 'regular'"
            v-for="day in patient.session_days"
            :key="day"
            class="font-body text-xs px-2 py-0.5 rounded bg-secondary/10 text-secondary font-medium"
          >
            {{ WEEKDAY_LABELS[day] ?? day }}
          </span>
          <span
            v-if="patient.session_time"
            class="font-body text-xs px-2 py-0.5 rounded bg-secondary/10 text-secondary font-medium"
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

      <!-- Nova anotação -->
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

      <!-- Lista de anotações -->
      <div v-if="localNotes.length > 0" class="space-y-2">
        <div
          v-for="note in localNotes"
          :key="note.id"
          class="border border-border/20 rounded-lg p-3 group"
        >
          <!-- Modo edição -->
          <template v-if="editingNoteId === note.id">
            <textarea
              v-model="editingContent"
              rows="3"
              class="w-full text-sm font-body border border-border/50 rounded-lg p-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none transition mb-2"
            ></textarea>
            <div class="flex gap-2">
              <button
                @click="confirmEdit(note.id)"
                :disabled="!editingContent.trim() || savingEdit"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-body text-xs font-medium hover:bg-primary/90 disabled:opacity-40 transition"
              >
                <Save class="w-3 h-3" />
                {{ savingEdit ? "Salvando..." : "Salvar" }}
              </button>
              <button
                @click="cancelEdit"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 font-body text-xs font-medium hover:bg-muted transition"
              >
                <X class="w-3 h-3" />
                Cancelar
              </button>
            </div>
          </template>

          <!-- Modo visualização -->
          <template v-else>
            <div class="flex items-center justify-between mb-1.5">
              <div class="flex items-center gap-1.5">
                <Clock4 class="w-3 h-3 text-muted-foreground" />
                <span class="font-body text-xs text-muted-foreground">
                  {{ formatDate(note.created_at) }}
                </span>
              </div>
              <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button
                  @click="startEdit(note)"
                  class="p-1 rounded hover:bg-muted transition"
                  title="Editar anotação"
                >
                  <Pencil class="w-3 h-3 text-muted-foreground" />
                </button>
                <button
                  @click="deleteNote(note.id)"
                  class="p-1 rounded hover:bg-destructive/10 transition"
                  title="Excluir anotação"
                >
                  <Trash2 class="w-3 h-3 text-destructive" />
                </button>
              </div>
            </div>
            <p class="font-body text-sm text-foreground leading-relaxed">
              {{ note.content }}
            </p>
          </template>
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
  X,
} from "lucide-vue-next";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  createClinicalNote,
  updateClinicalNote,
  deleteClinicalNote,
  type PatientUser,
  type ClinicalNote,
} from "@/services/dashboard";

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

// ── Estado local de notas (evita mutação direta da prop) ──────────────────
const localNotes = ref<ClinicalNote[]>([...(props.patient.clinical_notes ?? [])]);

// Sincroniza quando o painel reabre (parent pode ter recarregado os dados)
watch(
  () => props.isOpen,
  (opened) => {
    if (opened) {
      localNotes.value = [...(props.patient.clinical_notes ?? [])];
    }
    newNote.value = "";
    cancelEdit();
  },
);

// ── Criar nota ────────────────────────────────────────────────────────────
const newNote = ref("");
const savingNote = ref(false);

async function saveNote() {
  const text = newNote.value.trim();
  if (!text || savingNote.value) return;

  savingNote.value = true;
  try {
    const note = await createClinicalNote(props.patient.id, text);
    localNotes.value.unshift(note);
    emit("note-saved", props.patient.id, note);
    newNote.value = "";
  } catch {
    // silencioso — toast pode ser adicionado futuramente
  } finally {
    savingNote.value = false;
  }
}

// ── Editar nota ───────────────────────────────────────────────────────────
const editingNoteId = ref<number | null>(null);
const editingContent = ref("");
const savingEdit = ref(false);

function startEdit(note: ClinicalNote) {
  editingNoteId.value = note.id;
  editingContent.value = note.content;
}

function cancelEdit() {
  editingNoteId.value = null;
  editingContent.value = "";
}

async function confirmEdit(noteId: number) {
  const text = editingContent.value.trim();
  if (!text || savingEdit.value) return;

  savingEdit.value = true;
  try {
    const updated = await updateClinicalNote(props.patient.id, noteId, text);
    const idx = localNotes.value.findIndex((n) => n.id === noteId);
    if (idx !== -1) localNotes.value[idx] = updated;
    cancelEdit();
  } catch {
    // silencioso
  } finally {
    savingEdit.value = false;
  }
}

// ── Excluir nota ──────────────────────────────────────────────────────────
async function deleteNote(noteId: number) {
  try {
    await deleteClinicalNote(props.patient.id, noteId);
    localNotes.value = localNotes.value.filter((n) => n.id !== noteId);
  } catch {
    // silencioso
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────
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

function formatSingleDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "EEE, dd/MM", { locale: ptBR });
  } catch {
    return dateStr;
  }
}

function statusLabel(status: string): string {
  if (status === "scheduled") return "Agendada";
  if (status === "completed") return "Concluída";
  if (status === "absent") return "Falta";
  return status;
}
</script>
