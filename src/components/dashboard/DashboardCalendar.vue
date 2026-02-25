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
        <div v-if="totalPages > 1" class="flex items-center gap-1 ml-auto mr-4">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="p-1.5 hover:bg-muted rounded-lg transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft class="w-4 h-4 text-muted-foreground" />
          </button>
          <span class="text-xs font-body"
            >{{ currentPage }} / {{ totalPages }}</span
          >
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="p-1.5 hover:bg-muted rounded-lg transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronRight class="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <CalendarPlus
          @click="openCreateSessionModal"
          class="w-5 h-5 text-primary cursor-pointer hover:rotate-10 transition"
          title="Adicionar sessão extra neste dia"
        />
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
          <div class="flex items-center gap-3 min-w-0">
            <div class="shrink-0">
              <IconWithTooltip
                v-if="session.status === 'completed'"
                text="Sessão realizada"
              >
                <Check class="w-4 h-4 text-green-500" />
              </IconWithTooltip>

              <IconWithTooltip
                v-else-if="session.status === 'absent'"
                text="Paciente ausente"
              >
                <X class="w-4 h-4 text-red-500" />
              </IconWithTooltip>

              <IconWithTooltip
                v-else-if="session.status === 'cancelled'"
                text="Sessão cancelada"
              >
                <Ban class="w-4 h-4 text-muted-foreground" />
              </IconWithTooltip>

              <IconWithTooltip v-else text="Sessão agendada">
                <Clock class="w-4 h-4 text-yellow-500" />
              </IconWithTooltip>
            </div>

            <div
              class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-body text-sm font-semibold text-primary shrink-0"
            >
              {{ initials(session.patient?.name) }}
            </div>

            <div class="min-w-0">
              <div class="flex items-center gap-1.5 flex-wrap">
                <p class="font-body font-semibold text-sm text-foreground">
                  {{ session.patient?.name ?? "Paciente" }}
                </p>
                <span
                  v-if="session.session_type === 'extra'"
                  class="px-1.5 py-0.5 rounded text-xs font-body font-medium bg-amber-100 text-amber-700"
                >
                  Extra
                </span>
              </div>
              <p class="font-body text-xs text-muted-foreground">
                {{ session.time }}
              </p>
            </div>
          </div>

          <div class="flex flex-col items-end gap-1 shrink-0">
            <template v-if="session.status === 'cancelled'">
              <span class="text-xs text-muted-foreground italic"
                >Cancelada</span
              >
            </template>

            <template v-else-if="session.status === 'completed'">
              <button
                @click="confirmAbsent(session)"
                class="text-xs text-red-500 hover:underline whitespace-nowrap"
              >
                Registrar falta
              </button>
              <button
                @click="confirmCancel(session)"
                class="text-xs text-muted-foreground hover:underline whitespace-nowrap"
              >
                Cancelar sessão
              </button>
            </template>

            <template v-else-if="session.status === 'scheduled'">
              <a
                v-if="!isSelectedDatePast && session.patient?.google_meet_link"
                :href="session.patient.google_meet_link"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-1 text-xs font-body font-medium text-secondary hover:underline"
              >
                <Video class="w-3.5 h-3.5" />
                Google Meet
              </a>
              <button
                v-else-if="
                  !isSelectedDatePast && !session.patient?.google_meet_link
                "
                @click="emit('edit-patient', session.patient.id)"
                class="flex items-center gap-1 text-xs font-body font-medium text-orange-500 hover:underline"
              >
                <Video class="w-3.5 h-3.5" />
                Adicionar link do Meet
              </button>
              <button
                @click="confirmCancel(session)"
                class="text-xs text-muted-foreground hover:underline whitespace-nowrap"
              >
                Cancelar sessão
              </button>
            </template>
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

    <Teleport to="body">
      <div
        v-if="showCancelModal && cancelTarget"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        @click.self="closeCancelModal"
      >
        <div class="bg-card rounded-2xl shadow-lg w-full max-w-sm p-6">
          <p class="font-body text-base text-muted-foreground mb-6">
            Tem certeza que deseja cancelar esta sessão?
          </p>
          <div class="flex flex-col gap-2 mb-4">
            <p class="font-bold">Dados da sessão:</p>
            <p class="ml-4">Paciente: {{ cancelTarget.patient?.name }}</p>
            <p class="ml-4">Data: {{ cancelTarget.date }}</p>
            <p class="ml-4">Horário: {{ cancelTarget.time }}</p>
          </div>
          <div class="flex gap-3">
            <button
              @click="closeCancelModal"
              class="flex-1 py-2.5 rounded-lg border border-border/60 font-body text-sm font-medium hover:bg-muted transition"
            >
              Voltar
            </button>
            <button
              @click="handleSessionCancelled(cancelTarget.id)"
              :disabled="cancelLoading"
              class="flex-1 py-2.5 rounded-lg bg-muted text-foreground font-body text-sm font-medium hover:bg-muted/80 disabled:opacity-50 transition"
            >
              {{ cancelLoading ? "Cancelando..." : "Cancelar sessão" }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <ConfirmAddSessionModal
      :is-open="showCreateSessionModal"
      :date="selectedDate"
      :patients="patients"
      @close="closeCreateSessionModal"
      @created="handleSessionCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import {
  Ban,
  Calendar as CalendarIcon,
  CalendarPlus,
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
  type PatientUser,
  updateSessionStatus,
} from "@/services/dashboard";
import ConfirmAbsentModal from "@/components/dashboard/modals/ConfirmAbsentModal.vue";
import ConfirmAddSessionModal from "@/components/dashboard/modals/ConfirmAddSessionModal.vue";
import IconWithTooltip from "@/components/ui/IconWithTooltip.vue";

interface CalendarCell {
  day: number | null;
  date: Date | null;
  isToday: boolean;
  hasSession: boolean;
}

const props = defineProps<{
  sessions: CalendarSession[];
  patients: PatientUser[];
}>();

const emit = defineEmits<{
  (e: "edit-patient", patientId: number): void;
  (e: "load-dashboard"): void;
}>();

const weekDayLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const calendarBase = ref(new Date());
const selectedDate = ref<Date>(startOfDay(new Date()));
const currentPage = ref(1);
const perPage = 4;

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

const isSelectedDatePast = computed(() =>
  isBefore(startOfDay(selectedDate.value), startOfDay(new Date())),
);

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

function initials(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

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
    if (session) session.status = updated.status;
  } catch (error) {
    console.error("Erro ao marcar falta:", error);
  } finally {
    closeAbsentModal();
  }
}

/* ---------------------------
   Cancel Modal
---------------------------- */
const showCancelModal = ref(false);
const cancelTarget = ref<CalendarSession | null>(null);
const cancelLoading = ref(false);

function confirmCancel(session: CalendarSession) {
  cancelTarget.value = session;
  showCancelModal.value = true;
}

function closeCancelModal() {
  showCancelModal.value = false;
  cancelTarget.value = null;
  cancelLoading.value = false;
}

async function handleSessionCancelled(sessionId: number) {
  cancelLoading.value = true;
  try {
    const updated = await updateSessionStatus(sessionId, "cancelled");
    const session = sessionsOfSelectedDay.value.find((s) => s.id === sessionId);
    if (session) session.status = updated.status;
  } catch (error) {
    console.error("Erro ao cancelar sessão:", error);
  } finally {
    closeCancelModal();
  }
}

/* ---------------------------
   Add Session Modal
---------------------------- */
const showCreateSessionModal = ref(false);

function openCreateSessionModal() {
  showCreateSessionModal.value = true;
}

function closeCreateSessionModal() {
  showCreateSessionModal.value = false;
}

function handleSessionCreated(newSession: CalendarSession) {
  emit("load-dashboard");
}
</script>
