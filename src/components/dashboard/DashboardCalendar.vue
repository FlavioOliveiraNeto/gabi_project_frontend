<template>
  <div
    class="grid grid-cols-1 gap-4 items-stretch md:grid md:grid-cols-2 md:gap-6"
  >
    <div class="border border-border/50 rounded-xl p-6 bg-card mb-6">
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
          @click="selectDate(cell)"
          class="relative min-w-0 aspect-square flex items-center justify-center rounded-lg text-sm font-body transition-colors border cursor-pointer"
          :class="[
            getCellClass(cell),
            selectedDate &&
            cell.date &&
            format(cell.date, 'yyyy-MM-dd') ===
              format(selectedDate, 'yyyy-MM-dd')
              ? 'ring-2 ring-primary'
              : '',
          ]"
        >
          <span v-if="cell.day">{{ cell.day }}</span>
          <span
            v-if="cell.day && cell.hasSession && !cell.isToday"
            class="w-full h-full absolute rounded-lg bg-secondary opacity-40"
          ></span>
        </div>
      </div>
    </div>

    <div
      class="border border-border/50 rounded-xl p-6 bg-card mb-6 flex flex-col"
    >
      <div class="flex items-center justify-between mb-5">
        <h3 class="font-display text-xl text-foreground">
          {{ format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR }) }}
        </h3>
        <div v-if="totalPages > 1" class="flex items-center gap-1 ml-auto">
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
      </div>

      <div v-if="sessionsOfSelectedDay.length === 0" class="text-center py-6">
        <p class="font-body text-sm text-muted-foreground">
          Nenhum atendimento neste dia.
        </p>
      </div>

      <div v-else class="space-y-3 overflow-y-auto flex-1 pr-2">
        <div
          v-for="session in paginatedSessions"
          :key="session.id"
          class="border border-border/30 rounded-xl p-4 flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <div>
              <Check
                v-if="session.status === 'completed'"
                class="w-4 h-4 text-green-500"
              />

              <X
                v-else-if="session.status === 'absent'"
                class="w-4 h-4 text-red-500"
              />

              <Clock v-else class="w-4 h-4 text-yellow-500" />
            </div>

            <div
              class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-body text-sm font-semibold text-primary"
            >
              {{ initials(session.patient?.name) }}
            </div>

            <div>
              <p class="font-body font-semibold text-sm text-foreground">
                {{ session.patient?.name ?? "Paciente" }}
              </p>
              <p class="font-body text-xs text-muted-foreground">
                {{ session.time }}
              </p>
            </div>
          </div>

          <button
            v-if="session.status === 'completed'"
            @click="confirmAbsent(session)"
            class="text-xs text-red-500 hover:underline"
          >
            Registrar falta
          </button>

          <div v-if="!isSelectedDatePast && session.status == 'scheduled'">
            <a
              v-if="session.patient?.google_meet_link"
              :href="session.patient.google_meet_link"
              target="_blank"
              class="flex items-center gap-1 text-xs font-body font-medium text-secondary hover:underline"
            >
              <Video class="w-3.5 h-3.5" />
              Google Meet
            </a>
            <button
              v-else
              @click="emit('edit-patient', session.patient.id)"
              class="flex items-center gap-1 text-xs font-body font-medium text-orange-500 hover:underline"
            >
              <Video class="w-3.5 h-3.5" />
              Adicionar link do Google Meet
            </button>
          </div>
        </div>
      </div>
    </div>

    <ConfirmAbsentModal
      :is-open="showAbsentModal"
      :target="absentTarget"
      @close="closeAbsentModal"
      @absent="handleSessionAbsent"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import {
  Calendar as CalendarIcon,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Video,
  X,
} from "lucide-vue-next";
import {
  format,
  startOfDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
  subMonths,
  isBefore,
  isToday,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  type CalendarSession,
  updateSessionStatus,
} from "@/services/dashboard";
import ConfirmAbsentModal from "@/components/dashboard/modals/ConfirmAbsentModal.vue";

const props = defineProps<{
  sessions: CalendarSession[];
}>();

const emit = defineEmits<{
  (e: "edit-patient", patientId: number): void;
}>();

const weekDayLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const calendarBase = ref(new Date());
const selectedDate = ref<Date>(startOfDay(new Date()));
const currentPage = ref(1);
const perPage = 4;

function initials(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

const currentMonthLabel = computed(() =>
  format(calendarBase.value, "MMMM yyyy", { locale: ptBR }).replace(
    /^\w/,
    (c) => c.toUpperCase(),
  ),
);

const sessionsByDate = computed(() => {
  const map: Record<string, CalendarSession[]> = {};
  (props.sessions ?? []).forEach((s) => {
    if (!map[s.date]) map[s.date] = [];
    map[s.date].push(s);
  });
  return map;
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
    cells.push({
      day: null,
      date: null,
      isToday: false,
      hasSession: false,
    });
  }

  days.forEach((d) => {
    const key = format(d, "yyyy-MM-dd");

    cells.push({
      day: d.getDate(),
      date: d,
      isToday: isToday(d),
      hasSession: Boolean(sessionsByDate.value[key]),
    });
  });

  return cells;
});

const sessionsOfSelectedDay = computed(() => {
  const key = format(selectedDate.value, "yyyy-MM-dd");
  return sessionsByDate.value[key] ?? [];
});

const isSelectedDatePast = computed(() => {
  return isBefore(startOfDay(selectedDate.value), startOfDay(new Date()));
});

const paginatedSessions = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return sessionsOfSelectedDay.value.slice(start, start + perPage);
});

const totalPages = computed(
  () => Math.ceil(sessionsOfSelectedDay.value.length / perPage) || 1,
);

watch(selectedDate, () => {
  currentPage.value = 1;
});

function getCellClass(cell: CalendarCell) {
  if (!cell.day) return "cursor-default border-transparent";
  if (cell.isToday)
    return "bg-primary text-primary-foreground font-semibold border-transparent";
  if (cell.hasSession)
    return "bg-muted/60 text-foreground hover:bg-muted border-border/20";
  return "text-muted-foreground hover:bg-muted/40 border-transparent";
}

function prevMonth() {
  calendarBase.value = subMonths(calendarBase.value, 1);
}
function nextMonth() {
  calendarBase.value = addMonths(calendarBase.value, 1);
}
function selectDate(cell: CalendarCell) {
  if (!cell.date) return;
  selectedDate.value = cell.date;
}

/* ---------------------------
   Absent Modal
---------------------------- */
const showAbsentModal = ref(false);
const absentTarget = ref<CalendarSession | null>(null);

function confirmAbsent(session: CalendarSession) {
  absentTarget.value = session;
  showAbsentModal.value = true;
}

function closeAbsentModal() {
  showAbsentModal.value = false;
  absentTarget.value = null;
}

async function handleSessionAbsent(sessionId: number) {
  try {
    const updated = await updateSessionStatus(sessionId, "absent");

    const session = sessionsOfSelectedDay.value.find((s) => s.id === sessionId);

    if (session) {
      session.status = updated.status;
    }
  } catch (error) {
    console.error("Erro ao marcar falta:", error);
  } finally {
    closeAbsentModal();
  }
}
</script>
