<template>
  <div class="min-h-screen bg-lavender-light">
    <NavBar variant="internal">
      <template #right>
        <span class="hidden sm:block font-body text-sm text-muted-foreground">
          Olá, {{ user ? user?.name : "Usuário" }}
        </span>
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
      <div class="mb-8">
        <h2 class="block sm:hidden font-display text-2xl text-primary">
          Olá, {{ user ? user?.name : "Usuário" }}
        </h2>
        <p class="hidden sm:block font-body text-sm text-muted-foreground">
          {{ todayFormatted }}
        </p>
      </div>

      <!-- STATS -->
      <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div
          class="border border-border/50 rounded-xl p-5 bg-card flex flex-col gap-3 min-w-0"
        >
          <div class="flex items-center gap-2">
            <div class="p-2 rounded-lg bg-primary/10">
              <Users class="w-4 h-4 text-primary" />
            </div>
            <h3 class="font-body text-sm font-medium text-muted-foreground">
              Pacientes
            </h3>
          </div>
          <div>
            <p class="font-display text-3xl text-foreground">
              {{ stats.activePatients }}
            </p>
            <p class="font-body text-xs text-muted-foreground mt-0.5">ativos</p>
          </div>
        </div>

        <div
          class="border border-border/50 rounded-xl p-5 bg-card flex flex-col gap-3 min-w-0"
        >
          <div class="flex items-center gap-2">
            <div class="p-2 rounded-lg bg-secondary/10">
              <CalendarIcon class="w-4 h-4 text-secondary" />
            </div>
            <h3 class="font-body text-sm font-medium text-muted-foreground">
              Hoje
            </h3>
          </div>
          <div>
            <p class="font-display text-3xl text-foreground">
              {{ stats.todaySessions }}
            </p>
            <p class="font-body text-xs text-muted-foreground mt-0.5">
              sessões agendadas
            </p>
          </div>
        </div>

        <div
          class="border border-border/50 rounded-xl p-5 bg-card flex flex-col gap-3 min-w-0"
        >
          <div class="flex items-center gap-2">
            <div class="p-2 rounded-lg bg-primary/10">
              <Clock class="w-4 h-4 text-primary" />
            </div>
            <h3 class="font-body text-sm font-medium text-muted-foreground">
              Esta Semana
            </h3>
          </div>
          <div>
            <p class="font-display text-3xl text-foreground">
              {{ stats.weekSessions }}
            </p>
            <p class="font-body text-xs text-muted-foreground mt-0.5">
              sessões
            </p>
          </div>
        </div>

        <div
          class="border border-border/50 rounded-xl p-5 bg-card flex flex-col gap-3 min-w-0"
        >
          <div class="flex items-center gap-2">
            <div class="p-2 rounded-lg bg-secondary/10">
              <TrendingUp class="w-4 h-4 text-secondary" />
            </div>
            <h3 class="font-body text-sm font-medium text-muted-foreground">
              Este Mês
            </h3>
          </div>
          <div>
            <p class="font-display text-3xl text-foreground">
              {{ stats.monthSessions }}
            </p>
            <p class="font-body text-xs text-muted-foreground mt-0.5">
              sessões
            </p>
          </div>
        </div>
      </div>

      <!-- MAIN GRID -->
      <div class="grid gap-6 grid-cols-1 lg:grid-cols-5">
        <!-- LEFT -->
        <div class="lg:col-span-3 space-y-6 min-w-0">
          <!-- CALENDAR -->
          <div class="border border-border/50 rounded-xl p-6 bg-card">
            <div class="flex items-center gap-3 mb-5">
              <CalendarIcon class="w-5 h-5 text-primary" />
              <h3 class="font-display text-xl text-foreground">
                {{ currentMonthLabel }}
              </h3>
              <div class="flex items-center gap-1 ml-auto">
                <button
                  @click="prevMonth"
                  class="p-1.5 hover:bg-muted rounded-lg transition"
                >
                  <ChevronLeft class="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  @click="nextMonth"
                  class="p-1.5 hover:bg-muted rounded-lg transition"
                >
                  <ChevronRight class="w-4 h-4 text-muted-foreground" />
                </button>
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

          <!-- UPCOMING -->
          <div class="border border-border/50 rounded-xl p-6 bg-card">
            <div class="flex items-center gap-3 mb-5">
              <Clock class="w-5 h-5 text-primary" />
              <h3 class="font-display text-xl text-foreground">
                Próximas Sessões
              </h3>
              <span
                class="ml-auto font-body text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full"
              >
                {{ upcomingSessions.length }} agendadas
              </span>
            </div>

            <div class="space-y-3">
              <div
                v-for="session in upcomingSessions"
                :key="session.id"
                class="border border-border/30 rounded-xl p-4 flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <div class="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-body text-xs font-semibold text-primary"
                  >
                    {{ initials(session.name) }}
                  </div>

                  <div class="flex-1 min-w-0">
                    <p class="font-body font-medium text-sm truncate">
                      {{ session.name }}
                    </p>
                    <div class="flex flex-wrap gap-2 mt-1">
                      <span
                        class="font-body text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground"
                      >
                        {{ session.type }}
                      </span>
                      <span class="font-body text-xs text-muted-foreground">
                        {{ session.dateLabel }}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  class="flex flex-wrap items-center gap-3 sm:gap-4 sm:justify-end w-full sm:w-auto"
                >
                  <div
                    class="flex items-center gap-1"
                    :class="
                      session.absences > 0
                        ? 'text-amber-500'
                        : 'text-muted-foreground'
                    "
                  >
                    <AlertCircle class="w-3.5 h-3.5" />
                    <span class="font-body text-xs">
                      {{ session.absences }}
                      falta{{ session.absences !== 1 ? "s" : "" }}
                    </span>
                  </div>

                  <span class="font-body text-sm font-semibold text-primary">
                    {{ session.time }}
                  </span>

                  <a
                    :href="session.meetLink"
                    target="_blank"
                    class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/10 hover:bg-secondary/20 text-secondary transition text-xs font-body font-medium"
                  >
                    <Video class="w-3.5 h-3.5" />
                    Meet
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT -->
        <div class="lg:col-span-2">
          <div
            class="border border-border/50 rounded-xl p-6 bg-card lg:sticky lg:top-24"
          >
            <div class="flex items-center gap-3 mb-5">
              <FileText class="w-5 h-5 text-primary" />
              <h3 class="font-display text-xl text-foreground">Anotações</h3>
            </div>

            <div class="relative mb-4">
              <Search
                class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                v-model="patientSearch"
                type="text"
                placeholder="Buscar paciente..."
                class="w-full min-w-0 pl-9 pr-4 py-2.5 text-sm font-body border border-border/50 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
              />
            </div>

            <div class="space-y-2 max-h-[60vh] overflow-y-auto">
              <div v-for="patient in filteredPatients" :key="patient.id">
                <!-- Patient row -->
                <button
                  @click="togglePatient(patient.id)"
                  class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/50 transition text-left group"
                  :class="selectedPatient === patient.id ? 'bg-muted/70' : ''"
                >
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-body text-xs font-semibold transition"
                    :class="
                      selectedPatient === patient.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary/15 text-secondary'
                    "
                  >
                    {{ initials(patient.name) }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p
                      class="font-body text-sm font-medium text-foreground truncate"
                    >
                      {{ patient.name }}
                    </p>
                    <p class="font-body text-xs text-muted-foreground">
                      {{ patient.notes.length }} anotaç{{
                        patient.notes.length !== 1 ? "ões" : "ão"
                      }}
                    </p>
                  </div>
                  <ChevronRight
                    class="w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200"
                    :class="selectedPatient === patient.id ? 'rotate-90' : ''"
                  />
                </button>
                <!-- Expanded notes panel -->
                <div
                  v-if="selectedPatient === patient.id"
                  class="mx-1 mt-1 mb-2 border border-border/30 rounded-xl overflow-hidden"
                >
                  <!-- New note input -->
                  <div class="p-3 bg-background/60">
                    <textarea
                      v-model="newNote"
                      placeholder="Nova anotação sobre este paciente..."
                      class="w-full text-sm font-body border border-border/50 rounded-lg p-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none transition placeholder:text-muted-foreground"
                      rows="3"
                    ></textarea>
                    <button
                      @click="saveNote(patient.id)"
                      :disabled="!newNote.trim()"
                      class="mt-2 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-primary text-primary-foreground font-body text-sm font-medium hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      <Save class="w-3.5 h-3.5" /> Salvar anotação
                    </button>
                  </div>
                  <!-- Notes history -->
                  <div
                    v-if="patient.notes.length > 0"
                    class="border-t border-border/30"
                  >
                    <div class="px-3 py-2 bg-muted/30">
                      <p
                        class="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                      >
                        Histórico
                      </p>
                    </div>
                    <div class="divide-y divide-border/20">
                      <div
                        v-for="note in patient.notes"
                        :key="note.id"
                        class="px-3 py-3"
                      >
                        <div class="flex items-center gap-1.5 mb-1.5">
                          <Clock4 class="w-3 h-3 text-muted-foreground" />
                          <span class="font-body text-xs text-muted-foreground">
                            {{ note.date }}
                          </span>
                        </div>
                        <p
                          class="font-body text-sm text-foreground leading-relaxed"
                        >
                          {{ note.content }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    v-else
                    class="border-t border-border/30 px-3 py-4 text-center"
                  >
                    <p class="font-body text-xs text-muted-foreground">
                      Nenhuma anotação ainda.
                    </p>
                  </div>
                </div>
              </div>
              <!-- Empty state -->
              <div
                v-if="filteredPatients.length === 0"
                class="text-center py-8"
              >
                <p class="font-body text-sm text-muted-foreground">
                  Nenhum paciente encontrado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import {
  LogOut,
  Users,
  Clock,
  TrendingUp,
  AlertCircle,
  Video,
  FileText,
  Search,
  Save,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock4,
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
} from "date-fns";
import { ptBR } from "date-fns/locale";

// ─── Auth ───────────────────────────────────────────────────────────────────

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

// ─── Today label ─────────────────────────────────────────────────────────────

const todayFormatted = computed(() =>
  format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR }),
);

const todayDay = computed(() => format(new Date(), "d"));

// ─── Stats ────────────────────────────────────────────────────────────────────

const stats = {
  activePatients: 12,
  todaySessions: 5,
  weekSessions: 18,
  monthSessions: 64,
};

// ─── Calendar ────────────────────────────────────────────────────────────────

const calendarBase = ref(new Date());

// Days that have sessions (day numbers for the displayed month)
const sessionDays: Record<string, number[]> = {
  "2026-02": [3, 5, 10, 12, 17, 19, 20, 24, 26],
  "2026-03": [2, 4, 9, 11, 16, 18, 23, 25],
  "2026-01": [5, 7, 12, 14, 19, 21, 26, 28],
};

const weekDayLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const currentMonthLabel = computed(() =>
  format(calendarBase.value, "MMMM yyyy", { locale: ptBR }).replace(
    /^\w/,
    (c) => c.toUpperCase(),
  ),
);

const currentMonthKey = computed(() => format(calendarBase.value, "yyyy-MM"));

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
  const offset = getDay(first); // 0=Sun
  const monthSessions = sessionDays[currentMonthKey.value] ?? [];

  const cells: CalendarCell[] = [];

  // Blank cells before the 1st
  for (let i = 0; i < offset; i++) {
    cells.push({ day: null, date: null, isToday: false, hasSession: false });
  }

  days.forEach((d) => {
    cells.push({
      day: d.getDate(),
      date: d,
      isToday: isToday(d),
      hasSession: monthSessions.includes(d.getDate()),
    });
  });

  return cells;
});

function getCellClass(cell: CalendarCell) {
  if (!cell.day) return "cursor-default";
  if (cell.isToday)
    return "bg-primary text-primary-foreground font-semibold cursor-default";
  if (cell.hasSession)
    return "bg-muted/60 text-foreground cursor-default hover:bg-muted";
  return "text-muted-foreground cursor-default hover:bg-muted/40";
}

function prevMonth() {
  calendarBase.value = subMonths(calendarBase.value, 1);
}
function nextMonth() {
  calendarBase.value = addMonths(calendarBase.value, 1);
}

// ─── Upcoming sessions ───────────────────────────────────────────────────────

interface Session {
  id: number;
  name: string;
  time: string;
  type: string;
  meetLink: string;
  absences: number;
  dateLabel: string;
}

const upcomingSessions: Session[] = [
  {
    id: 1,
    name: "Ana Beatriz Oliveira",
    time: "08:00",
    type: "Individual",
    meetLink: "https://meet.google.com",
    absences: 0,
    dateLabel: "Hoje",
  },
  {
    id: 2,
    name: "Carlos Eduardo Santos",
    time: "09:30",
    type: "Individual",
    meetLink: "https://meet.google.com",
    absences: 1,
    dateLabel: "Hoje",
  },
  {
    id: 3,
    name: "Fernanda Lima",
    time: "11:00",
    type: "Casal",
    meetLink: "https://meet.google.com",
    absences: 0,
    dateLabel: "Hoje",
  },
  {
    id: 4,
    name: "João Pedro Mendes",
    time: "14:00",
    type: "Individual",
    meetLink: "https://meet.google.com",
    absences: 2,
    dateLabel: "Hoje",
  },
  {
    id: 5,
    name: "Mariana Costa",
    time: "15:30",
    type: "Individual",
    meetLink: "https://meet.google.com",
    absences: 0,
    dateLabel: "Hoje",
  },
  {
    id: 6,
    name: "Pedro Alves",
    time: "09:00",
    type: "Individual",
    meetLink: "https://meet.google.com",
    absences: 1,
    dateLabel: "Amanhã",
  },
  {
    id: 7,
    name: "Rafael Souza",
    time: "16:00",
    type: "Individual",
    meetLink: "https://meet.google.com",
    absences: 0,
    dateLabel: "Amanhã",
  },
];

// ─── Patient Notes ───────────────────────────────────────────────────────────

interface Note {
  id: number;
  date: string;
  content: string;
}

interface Patient {
  id: number;
  name: string;
  notes: Note[];
}

const patients = ref<Patient[]>([
  {
    id: 1,
    name: "Ana Beatriz Oliveira",
    notes: [
      {
        id: 1,
        date: "12 jan. 2026",
        content:
          "Paciente demonstrou avanços significativos no manejo da ansiedade. Técnicas de respiração sendo aplicadas com sucesso no cotidiano.",
      },
      {
        id: 2,
        date: "26 jan. 2026",
        content:
          "Relatou dificuldades com o sono. Orientada sobre higiene do sono e estratégias de relaxamento antes de dormir.",
      },
      {
        id: 3,
        date: "09 fev. 2026",
        content:
          "Sessão focada em questões de autoestima. Trabalho com reestruturação cognitiva mostrando resultados positivos.",
      },
    ],
  },
  {
    id: 2,
    name: "Carlos Eduardo Santos",
    notes: [
      {
        id: 4,
        date: "05 jan. 2026",
        content:
          "Início do processo terapêutico. Queixa principal: estresse laboral e conflitos interpessoais no trabalho.",
      },
      {
        id: 5,
        date: "19 jan. 2026",
        content:
          "Apresentou melhora na comunicação assertiva. Relatou episódio bem administrado com chefe direto.",
      },
    ],
  },
  {
    id: 3,
    name: "Fernanda Lima",
    notes: [
      {
        id: 6,
        date: "08 fev. 2026",
        content:
          "Terapia de casal. Parceiros apresentando maior disposição ao diálogo. Exercícios de escuta ativa realizados na sessão.",
      },
    ],
  },
  {
    id: 4,
    name: "João Pedro Mendes",
    notes: [
      {
        id: 7,
        date: "03 nov. 2025",
        content:
          "Avaliação inicial. Sintomas de depressão leve a moderada. Encaminhado para avaliação psiquiátrica concomitante.",
      },
      {
        id: 8,
        date: "17 nov. 2025",
        content:
          "Relata melhora após início da medicação. Sessão focada em ativação comportamental e estabelecimento de rotina.",
      },
      {
        id: 9,
        date: "01 dez. 2025",
        content:
          "Faltas recorrentes preocupam. Abordado com cuidado, paciente comprometeu-se a manter regularidade.",
      },
      {
        id: 10,
        date: "12 jan. 2026",
        content:
          "Boa sessão. Retomada de hobbies relatada como positiva. Continuar com exercícios de mindfulness.",
      },
    ],
  },
  {
    id: 5,
    name: "Lucia Ferreira",
    notes: [],
  },
  {
    id: 6,
    name: "Mariana Costa",
    notes: [
      {
        id: 11,
        date: "22 jan. 2026",
        content:
          "Trabalho de luto em andamento. Paciente conseguiu falar sobre a perda com menos sofrimento aparente. Progresso notável.",
      },
      {
        id: 12,
        date: "05 fev. 2026",
        content:
          "Relatou retomada de atividades sociais após longo período de isolamento. Reforçar rede de apoio.",
      },
    ],
  },
  {
    id: 7,
    name: "Pedro Alves",
    notes: [
      {
        id: 13,
        date: "10 fev. 2026",
        content:
          "Avaliação de fobia social. Técnicas de exposição gradual apresentadas. Tarefa para casa: frequentar um evento social pequeno.",
      },
    ],
  },
  {
    id: 8,
    name: "Rafael Souza",
    notes: [
      {
        id: 14,
        date: "15 dez. 2025",
        content:
          "Paciente relatou melhora no relacionamento conjugal após aplicação das técnicas de comunicação não violenta.",
      },
      {
        id: 15,
        date: "29 dez. 2025",
        content:
          "Sessão de revisão do ano. Progressos mapeados. Objetivos para 2026 estabelecidos em conjunto.",
      },
      {
        id: 16,
        date: "19 jan. 2026",
        content:
          "Retorno no ano novo com boa disposição. Manter frequência quinzenal.",
      },
    ],
  },
]);

const patientSearch = ref("");
const selectedPatient = ref<number | null>(null);
const newNote = ref("");

// Reset note text when switching patients
watch(selectedPatient, () => {
  newNote.value = "";
});

const filteredPatients = computed(() => {
  const q = patientSearch.value.toLowerCase().trim();
  const sorted = [...patients.value].sort((a: Patient, b: Patient) =>
    a.name.localeCompare(b.name, "pt-BR"),
  );
  if (!q) return sorted;
  return sorted.filter((p) => p.name.toLowerCase().includes(q));
});

function togglePatient(id: number) {
  selectedPatient.value = selectedPatient.value === id ? null : id;
}

function saveNote(patientId: number) {
  const text = newNote.value.trim();
  if (!text) return;

  const patient = patients.value.find((p) => p.id === patientId);
  if (!patient) return;

  const dateStr = format(new Date(), "dd MMM. yyyy", { locale: ptBR });
  const newId = Date.now();

  // Prepend new note (most recent first in save, but shown in chronological order)
  patient.notes.push({ id: newId, date: dateStr, content: text });

  newNote.value = "";
}
</script>
