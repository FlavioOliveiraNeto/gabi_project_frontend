<template>
  <div class="min-h-screen bg-lavender-light">
    <NavBar variant="internal">
      <template #right>
        <button
          @click="handleLogout"
          class="p-2 hover:bg-muted rounded-md transition"
        >
          <LogOut class="w-4 h-4" />
        </button>
      </template>
    </NavBar>

    <!-- MAIN -->
    <main class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-24 pb-12">
      <!-- Greeting -->
      <div class="sm:flex sm:justify-between sm:items-center my-6">
        <h2 class="font-display text-2xl text-primary">
          Olá, {{ user?.name ?? "Terapeuta" }}!
        </h2>
        <p class="font-body text-sm text-muted-foreground">
          {{ todayFormatted }}
        </p>
      </div>

      <!-- STATS -->
      <div class="grid gap-4 grid-cols-1 sm:grid-cols-3 mb-8">
        <div class="border border-border/50 rounded-xl p-5 bg-card flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <div class="p-2 rounded-lg bg-primary/10">
              <Users class="w-4 h-4 text-primary" />
            </div>
            <h3 class="font-body text-sm font-medium text-muted-foreground">Pacientes</h3>
          </div>
          <div>
            <p class="font-display text-3xl text-foreground">{{ stats.active_clients }}</p>
            <p class="font-body text-xs text-muted-foreground mt-0.5">ativos</p>
          </div>
        </div>

        <div class="border border-border/50 rounded-xl p-5 bg-card flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <div class="p-2 rounded-lg bg-secondary/10">
              <CalendarIcon class="w-4 h-4 text-secondary" />
            </div>
            <h3 class="font-body text-sm font-medium text-muted-foreground">Hoje</h3>
          </div>
          <div>
            <p class="font-display text-3xl text-foreground">{{ stats.today_sessions }}</p>
            <p class="font-body text-xs text-muted-foreground mt-0.5">sessões agendadas</p>
          </div>
        </div>

        <div class="border border-border/50 rounded-xl p-5 bg-card flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <div class="p-2 rounded-lg bg-primary/10">
              <Clock class="w-4 h-4 text-primary" />
            </div>
            <h3 class="font-body text-sm font-medium text-muted-foreground">Esta Semana</h3>
          </div>
          <div>
            <p class="font-display text-3xl text-foreground">{{ stats.sessions_this_week }}</p>
            <p class="font-body text-xs text-muted-foreground mt-0.5">sessões realizadas</p>
          </div>
        </div>
      </div>

      <!-- CALENDAR -->
      <div class="border border-border/50 rounded-xl p-6 bg-card mb-6">
        <div class="flex items-center gap-3 mb-5">
          <CalendarIcon class="w-5 h-5 text-primary" />
          <h3 class="font-display text-xl text-foreground">{{ currentMonthLabel }}</h3>
          <div class="flex items-center gap-1 ml-auto">
            <button @click="prevMonth" class="p-1.5 hover:bg-muted rounded-lg transition">
              <ChevronLeft class="w-4 h-4 text-muted-foreground" />
            </button>
            <button @click="nextMonth" class="p-1.5 hover:bg-muted rounded-lg transition">
              <ChevronRight class="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        <!-- Day labels -->
        <div class="grid grid-cols-7 gap-1 w-full mb-1">
          <div
            v-for="label in weekDayLabels"
            :key="label"
            class="text-center text-xs font-body text-muted-foreground py-1"
          >
            {{ label }}
          </div>
        </div>

        <div class="grid grid-cols-7 gap-1 w-full">
          <div
            v-for="(cell, idx) in calendarCells"
            :key="idx"
            class="relative min-w-0 aspect-square flex items-center justify-center rounded-lg text-sm font-body transition-colors border"
            :class="getCellClass(cell)"
          >
            <span v-if="cell.day">{{ cell.day }}</span>
            <span
              v-if="cell.day && cell.hasSession && !cell.isToday"
              class="w-full h-full absolute rounded-lg bg-secondary opacity-40"
            ></span>
          </div>
        </div>
      </div>

      <!-- PATIENT LIST -->
      <div class="border border-border/50 rounded-xl p-6 bg-card">
        <div class="flex items-center gap-3 mb-5 flex-wrap">
          <FileText class="w-5 h-5 text-primary" />
          <h3 class="font-display text-xl text-foreground">Pacientes</h3>
          <span class="ml-auto font-body text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full">
            {{ patients.length }} cadastrado{{ patients.length !== 1 ? "s" : "" }}
          </span>
          <button
            @click="openCreateModal"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-body text-sm font-medium hover:bg-primary/90 transition"
          >
            <Plus class="w-4 h-4" /> Adicionar paciente
          </button>
        </div>

        <!-- Search -->
        <div class="relative mb-4">
          <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            v-model="patientSearch"
            type="text"
            placeholder="Buscar paciente..."
            class="w-full pl-9 pr-4 py-2.5 text-sm font-body border border-border/50 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
          />
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="text-center py-10">
          <p class="font-body text-sm text-muted-foreground">Carregando pacientes...</p>
        </div>

        <!-- Empty -->
        <div v-else-if="filteredPatients.length === 0" class="text-center py-10">
          <p class="font-body text-sm text-muted-foreground">
            {{ patientSearch ? "Nenhum paciente encontrado." : "Nenhum paciente cadastrado ainda." }}
          </p>
        </div>

        <!-- Patient rows -->
        <div v-else class="space-y-2">
          <div v-for="patient in filteredPatients" :key="patient.id">
            <div class="border border-border/30 rounded-xl p-4 hover:border-border/60 transition">
              <div class="flex items-start gap-3 flex-wrap">
                <!-- Avatar -->
                <div
                  class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-body text-sm font-semibold text-primary shrink-0"
                >
                  {{ initials(patient.name) }}
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <p class="font-body font-semibold text-sm text-foreground">{{ patient.name }}</p>
                    <p class="font-body text-xs text-muted-foreground">{{ patient.email }}</p>
                  </div>

                  <!-- Schedule badges -->
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

                  <!-- Stats -->
                  <div class="flex flex-wrap gap-4 mt-3">
                    <div class="flex items-center gap-1.5">
                      <CheckCircle class="w-3.5 h-3.5 text-green-600" />
                      <span class="font-body text-xs text-muted-foreground">
                        {{ patient.completed_sessions }} realizadas
                      </span>
                    </div>
                    <div
                      class="flex items-center gap-1.5"
                      :class="patient.absent_sessions > 0 ? 'text-amber-500' : 'text-muted-foreground'"
                    >
                      <AlertCircle class="w-3.5 h-3.5" />
                      <span class="font-body text-xs">
                        {{ patient.absent_sessions }} falta{{ patient.absent_sessions !== 1 ? "s" : "" }}
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

                <!-- Actions -->
                <div class="flex items-center gap-2 shrink-0">
                  <button
                    @click="togglePatient(patient.id)"
                    class="p-1.5 rounded-lg hover:bg-muted transition"
                    :title="selectedPatient === patient.id ? 'Fechar anotações' : 'Ver anotações'"
                  >
                    <FileText class="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    @click="openEditModal(patient)"
                    class="p-1.5 rounded-lg hover:bg-muted transition"
                    title="Editar paciente"
                  >
                    <Pencil class="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    @click="confirmDelete(patient)"
                    class="p-1.5 rounded-lg hover:bg-destructive/10 transition"
                    title="Excluir paciente"
                  >
                    <Trash2 class="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>

              <!-- Notes panel -->
              <div
                v-if="selectedPatient === patient.id"
                class="mt-4 border-t border-border/30 pt-4"
              >
                <p class="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Anotações clínicas (visíveis apenas para você)
                </p>

                <!-- New note -->
                <div class="mb-3">
                  <textarea
                    v-model="newNote"
                    placeholder="Nova anotação clínica..."
                    rows="3"
                    class="w-full text-sm font-body border border-border/50 rounded-lg p-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none transition"
                  ></textarea>
                  <button
                    @click="saveNote(patient.id)"
                    :disabled="!newNote.trim() || savingNote"
                    class="mt-2 flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-body text-sm font-medium hover:bg-primary/90 disabled:opacity-40 transition"
                  >
                    <Save class="w-3.5 h-3.5" />
                    {{ savingNote ? "Salvando..." : "Salvar anotação" }}
                  </button>
                </div>

                <!-- Notes list -->
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
                  <p class="font-body text-xs text-muted-foreground">Nenhuma anotação ainda.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- ── MODAL CRIAR / EDITAR PACIENTE ──────────────────────────────── -->
    <Teleport to="body">
      <div
        v-if="showCreateModal || showEditModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        @click.self="closeModals"
      >
        <div class="bg-card rounded-2xl shadow-lg w-full max-w-lg p-6 overflow-y-auto max-h-[90vh]">
          <div class="flex items-center justify-between mb-5">
            <h2 class="font-display text-xl text-foreground">
              {{ showEditModal ? "Editar paciente" : "Adicionar paciente" }}
            </h2>
            <button @click="closeModals" class="p-1.5 rounded-lg hover:bg-muted transition">
              <X class="w-4 h-4" />
            </button>
          </div>

          <form @submit.prevent="showEditModal ? handleUpdate() : handleCreate()" class="space-y-4">
            <!-- Nome -->
            <div class="space-y-1.5">
              <label class="font-body text-sm font-medium text-foreground">Nome completo *</label>
              <input
                v-model="modalForm.name"
                type="text"
                placeholder="Nome do paciente"
                class="w-full px-4 py-2.5 border border-border/60 rounded-lg text-sm font-body bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                :class="{ 'border-destructive': modalErrors.name }"
              />
              <p v-if="modalErrors.name" class="text-xs text-destructive font-body">{{ modalErrors.name }}</p>
            </div>

            <!-- E-mail -->
            <div class="space-y-1.5">
              <label class="font-body text-sm font-medium text-foreground">E-mail *</label>
              <input
                v-model="modalForm.email"
                type="email"
                placeholder="paciente@email.com"
                class="w-full px-4 py-2.5 border border-border/60 rounded-lg text-sm font-body bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                :class="{ 'border-destructive': modalErrors.email }"
              />
              <p v-if="modalErrors.email" class="text-xs text-destructive font-body">{{ modalErrors.email }}</p>
            </div>

            <!-- Google Meet -->
            <div class="space-y-1.5">
              <label class="font-body text-sm font-medium text-foreground">Link do Google Meet</label>
              <input
                v-model="modalForm.google_meet_link"
                type="url"
                placeholder="https://meet.google.com/..."
                class="w-full px-4 py-2.5 border border-border/60 rounded-lg text-sm font-body bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
              />
            </div>

            <!-- Sessões por semana -->
            <div class="space-y-1.5">
              <label class="font-body text-sm font-medium text-foreground">Sessões por semana</label>
              <select
                v-model.number="modalForm.sessions_per_week"
                class="w-full px-4 py-2.5 border border-border/60 rounded-lg text-sm font-body bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
              >
                <option :value="0">Não definido</option>
                <option v-for="n in 7" :key="n" :value="n">{{ n }}x por semana</option>
              </select>
            </div>

            <!-- Dias da semana -->
            <div class="space-y-1.5">
              <label class="font-body text-sm font-medium text-foreground">Dias das sessões</label>
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

            <!-- Horário -->
            <div class="space-y-1.5">
              <label class="font-body text-sm font-medium text-foreground">Horário da sessão</label>
              <input
                v-model="modalForm.session_time"
                type="time"
                class="w-full px-4 py-2.5 border border-border/60 rounded-lg text-sm font-body bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
              />
            </div>

            <!-- Erro global -->
            <p
              v-if="modalError"
              class="text-sm text-destructive font-body text-center bg-destructive/10 rounded-lg py-2 px-3"
            >
              {{ modalError }}
            </p>

            <div class="flex gap-3 pt-2">
              <button
                type="button"
                @click="closeModals"
                class="flex-1 py-2.5 rounded-lg border border-border/60 font-body text-sm font-medium hover:bg-muted transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="modalLoading"
                class="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground font-body text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition"
              >
                {{ modalLoading ? "Salvando..." : showEditModal ? "Salvar alterações" : "Cadastrar paciente" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- ── MODAL CONFIRMAR EXCLUSÃO ─────────────────────────────────── -->
    <Teleport to="body">
      <div
        v-if="deleteTarget"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        @click.self="deleteTarget = null"
      >
        <div class="bg-card rounded-2xl shadow-lg w-full max-w-sm p-6">
          <h2 class="font-display text-lg text-foreground mb-2">Excluir paciente</h2>
          <p class="font-body text-sm text-muted-foreground mb-6">
            Tem certeza que deseja excluir
            <strong class="text-foreground">{{ deleteTarget.name }}</strong>?
            Todas as anotações e sessões serão removidas permanentemente.
          </p>
          <div class="flex gap-3">
            <button
              @click="deleteTarget = null"
              class="flex-1 py-2.5 rounded-lg border border-border/60 font-body text-sm font-medium hover:bg-muted transition"
            >
              Cancelar
            </button>
            <button
              @click="handleDelete"
              :disabled="modalLoading"
              class="flex-1 py-2.5 rounded-lg bg-destructive text-destructive-foreground font-body text-sm font-medium hover:bg-destructive/90 disabled:opacity-50 transition"
            >
              {{ modalLoading ? "Excluindo..." : "Excluir" }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import {
  LogOut,
  Users,
  Clock,
  AlertCircle,
  Video,
  FileText,
  Search,
  Save,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock4,
  Plus,
  Pencil,
  Trash2,
  X,
  CheckCircle,
} from "lucide-vue-next";
import NavBar from "@/components/NavBar.vue";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
  subMonths,
  isToday,
  parseISO,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  getTherapistDashboard,
  createPatient,
  updatePatient,
  deletePatient,
  createClinicalNote,
  type PatientUser,
  type TherapistStats,
} from "@/services/dashboard";

// ─── Auth ────────────────────────────────────────────────────────────────────
const router = useRouter();
const { user, logout } = useAuth();

const handleLogout = () => {
  logout();
  router.push("/login");
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
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

const WEEKDAY_LABELS: Record<string, string> = {
  sunday: "Dom",
  monday: "Seg",
  tuesday: "Ter",
  wednesday: "Qua",
  thursday: "Qui",
  friday: "Sex",
  saturday: "Sáb",
};

// ─── Today label ─────────────────────────────────────────────────────────────
const todayFormatted = computed(() =>
  format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR }),
);

// ─── Stats & Patients ────────────────────────────────────────────────────────
const patients = ref<PatientUser[]>([]);
const stats = ref<TherapistStats>({
  active_clients: 0,
  today_sessions: 0,
  sessions_this_week: 0,
});
const isLoading = ref(true);

async function loadDashboard() {
  isLoading.value = true;
  try {
    const data = await getTherapistDashboard();
    patients.value = data.clients;
    stats.value = data.stats;
  } catch {
    // silently ignore; token might be expired
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadDashboard);

// ─── Calendar ────────────────────────────────────────────────────────────────
const calendarBase = ref(new Date());
const weekDayLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const currentMonthLabel = computed(() =>
  format(calendarBase.value, "MMMM yyyy", { locale: ptBR }).replace(
    /^\w/,
    (c) => c.toUpperCase(),
  ),
);

const sessionWeekdays = computed<number[]>(() => {
  const weekdayNums: Record<string, number> = {
    sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
    thursday: 4, friday: 5, saturday: 6,
  };
  const days = new Set<number>();
  patients.value.forEach((p) => {
    p.session_days.forEach((d) => {
      const n = weekdayNums[d];
      if (n !== undefined) days.add(n);
    });
  });
  return Array.from(days);
});

interface CalendarCell {
  day: number | null;
  date: Date | null;
  isToday: boolean;
  hasSession: boolean;
}

const calendarCells = computed<CalendarCell[]>(() => {
  const first = startOfMonth(calendarBase.value);
  const last = endOfMonth(calendarBase.value);
  const days = eachDayOfInterval({ start: first, end: last });
  const offset = getDay(first);

  const cells: CalendarCell[] = [];
  for (let i = 0; i < offset; i++) {
    cells.push({ day: null, date: null, isToday: false, hasSession: false });
  }

  days.forEach((d) => {
    cells.push({
      day: d.getDate(),
      date: d,
      isToday: isToday(d),
      hasSession: sessionWeekdays.value.includes(d.getDay()),
    });
  });

  return cells;
});

function getCellClass(cell: CalendarCell) {
  if (!cell.day) return "cursor-default border-transparent";
  if (cell.isToday)
    return "bg-primary text-primary-foreground font-semibold cursor-default border-transparent";
  if (cell.hasSession)
    return "bg-muted/60 text-foreground cursor-default hover:bg-muted border-border/20";
  return "text-muted-foreground cursor-default hover:bg-muted/40 border-transparent";
}

function prevMonth() { calendarBase.value = subMonths(calendarBase.value, 1); }
function nextMonth() { calendarBase.value = addMonths(calendarBase.value, 1); }

// ─── Patient search & notes panel ────────────────────────────────────────────
const patientSearch = ref("");
const selectedPatient = ref<number | null>(null);
const newNote = ref("");
const savingNote = ref(false);

watch(selectedPatient, () => { newNote.value = ""; });

const filteredPatients = computed(() => {
  const q = patientSearch.value.toLowerCase().trim();
  const sorted = [...patients.value].sort((a, b) =>
    a.name.localeCompare(b.name, "pt-BR"),
  );
  if (!q) return sorted;
  return sorted.filter((p) => p.name.toLowerCase().includes(q));
});

function togglePatient(id: number) {
  selectedPatient.value = selectedPatient.value === id ? null : id;
}

async function saveNote(patientId: number) {
  const text = newNote.value.trim();
  if (!text || savingNote.value) return;

  savingNote.value = true;
  try {
    const note = await createClinicalNote(patientId, text);
    const patient = patients.value.find((p) => p.id === patientId);
    if (patient) {
      patient.clinical_notes.unshift(note);
    }
    newNote.value = "";
  } catch {
    // silently ignore
  } finally {
    savingNote.value = false;
  }
}

// ─── Modal state ─────────────────────────────────────────────────────────────
const showCreateModal = ref(false);
const showEditModal = ref(false);
const editingPatientId = ref<number | null>(null);
const deleteTarget = ref<PatientUser | null>(null);
const modalLoading = ref(false);
const modalError = ref("");

const modalForm = reactive({
  name: "",
  email: "",
  google_meet_link: "",
  sessions_per_week: 0,
  weekdays: [] as string[],
  session_time: "",
});

const modalErrors = reactive<Record<string, string>>({});

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

function openCreateModal() {
  resetModal();
  showCreateModal.value = true;
}

function openEditModal(patient: PatientUser) {
  resetModal();
  modalForm.name = patient.name;
  modalForm.email = patient.email;
  modalForm.google_meet_link = patient.google_meet_link ?? "";
  modalForm.sessions_per_week = patient.sessions_per_week;
  modalForm.weekdays = [...patient.session_days];
  modalForm.session_time = patient.session_time ?? "";
  editingPatientId.value = patient.id;
  showEditModal.value = true;
}

function closeModals() {
  showCreateModal.value = false;
  showEditModal.value = false;
  editingPatientId.value = null;
  resetModal();
}

function validateModal(): boolean {
  Object.keys(modalErrors).forEach((k) => delete modalErrors[k]);
  if (!modalForm.name.trim()) modalErrors.name = "Nome é obrigatório.";
  if (!modalForm.email.trim()) modalErrors.email = "E-mail é obrigatório.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(modalForm.email))
    modalErrors.email = "E-mail inválido.";
  return Object.keys(modalErrors).length === 0;
}

async function handleCreate() {
  if (!validateModal()) return;
  modalLoading.value = true;
  modalError.value = "";
  try {
    const patient = await createPatient({
      name: modalForm.name.trim(),
      email: modalForm.email.trim(),
      google_meet_link: modalForm.google_meet_link.trim() || undefined,
      sessions_per_week: modalForm.sessions_per_week || undefined,
      weekdays: modalForm.weekdays.length > 0 ? modalForm.weekdays : undefined,
      session_time: modalForm.session_time || undefined,
    });
    patients.value.unshift(patient);
    stats.value.active_clients += 1;
    closeModals();
  } catch (err: any) {
    const msgs = err?.response?.data?.errors;
    modalError.value = Array.isArray(msgs) ? msgs.join(", ") : "Erro ao cadastrar paciente.";
  } finally {
    modalLoading.value = false;
  }
}

async function handleUpdate() {
  if (!validateModal() || !editingPatientId.value) return;
  modalLoading.value = true;
  modalError.value = "";
  try {
    const updated = await updatePatient(editingPatientId.value, {
      name: modalForm.name.trim(),
      email: modalForm.email.trim(),
      google_meet_link: modalForm.google_meet_link.trim() || undefined,
      sessions_per_week: modalForm.sessions_per_week || undefined,
      weekdays: modalForm.weekdays.length > 0 ? modalForm.weekdays : undefined,
      session_time: modalForm.session_time || undefined,
    });
    const idx = patients.value.findIndex((p) => p.id === updated.id);
    if (idx !== -1) patients.value[idx] = updated;
    closeModals();
  } catch (err: any) {
    const msgs = err?.response?.data?.errors;
    modalError.value = Array.isArray(msgs) ? msgs.join(", ") : "Erro ao atualizar paciente.";
  } finally {
    modalLoading.value = false;
  }
}

function confirmDelete(patient: PatientUser) {
  deleteTarget.value = patient;
}

async function handleDelete() {
  if (!deleteTarget.value) return;
  modalLoading.value = true;
  try {
    await deletePatient(deleteTarget.value.id);
    patients.value = patients.value.filter((p) => p.id !== deleteTarget.value!.id);
    stats.value.active_clients = Math.max(0, stats.value.active_clients - 1);
    if (selectedPatient.value === deleteTarget.value.id) selectedPatient.value = null;
    deleteTarget.value = null;
  } catch {
    // silently ignore
  } finally {
    modalLoading.value = false;
  }
}
</script>
