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

    <main class="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 pt-24 pb-12">
      
      <!-- Header -->
      <div class="sm:flex sm:justify-between sm:items-center my-6">
        <h2 class="font-display text-2xl text-primary">
          Olá, {{ user?.name ?? "Paciente" }}!
        </h2>
        <p class="font-body text-sm text-muted-foreground">
          {{ todayFormatted }}
        </p>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="text-center py-20">
        <p class="font-body text-sm text-muted-foreground">Carregando...</p>
      </div>

      <template v-else>

        <!-- ================= STATS ================= -->
        <div class="grid gap-4 grid-cols-1 sm:grid-cols-3 mb-8">

          <!-- Próxima sessão -->
          <div class="border border-border/50 rounded-xl p-5 bg-card flex flex-col gap-3">
            <div class="flex items-center gap-2">
              <div class="p-2 rounded-lg bg-primary/10">
                <CalendarIcon class="w-4 h-4 text-primary" />
              </div>
              <h3 class="font-body text-sm text-muted-foreground">
                Próxima Sessão
              </h3>
            </div>

            <div v-if="profile?.next_session">
              <p class="font-display text-base text-foreground">
                {{ formatNextDate(profile.next_session.date) }}
              </p>
              <p class="font-body text-sm text-primary font-semibold mt-0.5">
                {{ profile.next_session.time ?? "Horário a definir" }}
              </p>
            </div>

            <div v-else>
              <p class="font-body text-sm text-muted-foreground">
                Nenhuma sessão agendada
              </p>
            </div>
          </div>

          <!-- Sessões realizadas -->
          <div class="border border-border/50 rounded-xl p-5 bg-card flex flex-col gap-3">
            <div class="flex items-center gap-2">
              <div class="p-2 rounded-lg bg-primary/10">
                <CheckCircle class="w-4 h-4 text-primary" />
              </div>
              <h3 class="font-body text-sm text-muted-foreground">
                Sessões realizadas
              </h3>
            </div>

            <p class="font-display text-3xl text-foreground">
              {{ profile?.completed_sessions ?? 0 }}
            </p>
          </div>

          <!-- Faltas -->
          <div class="border border-border/50 rounded-xl p-5 bg-card flex flex-col gap-3">
            <div class="flex items-center gap-2">
              <div class="p-2 rounded-lg bg-secondary/10">
                <AlertCircle class="w-4 h-4 text-secondary" />
              </div>
              <h3 class="font-body text-sm text-muted-foreground">
                Faltas acumuladas
              </h3>
            </div>

            <p
              class="font-display text-3xl"
              :class="(profile?.absent_sessions ?? 0) > 0 ? 'text-amber-500' : 'text-foreground'"
            >
              {{ profile?.absent_sessions ?? 0 }}
            </p>
          </div>
        </div>

        <!-- ================= DETALHES DA SESSÃO ================= -->
        <div class="border border-border/50 rounded-xl p-6 bg-card mb-6 space-y-4">
          <div class="flex items-center gap-3">
            <Clock class="w-5 h-5 text-primary" />
            <h3 class="font-display text-xl text-foreground">
              Detalhes da Sessão
            </h3>
          </div>

          <div v-if="profile?.next_session" class="space-y-2">
            <p class="font-body text-sm text-muted-foreground">
              Data:
              <span class="text-foreground font-medium">
                {{ formatNextDate(profile.next_session.date) }}
              </span>
            </p>

            <p class="font-body text-sm text-muted-foreground">
              Horário:
              <span class="text-foreground font-medium">
                {{ profile.next_session.time ?? "A definir" }}
              </span>
            </p>
          </div>

          <p v-else class="font-body text-sm text-muted-foreground">
            Nenhuma sessão agendada. Entre em contato com sua terapeuta.
          </p>

          <!-- Botão do Meet apenas se for HOJE -->
          <a
            v-if="canJoinSession"
            :href="profile?.google_meet_link!"
            target="_blank"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/10 hover:bg-secondary/20 text-secondary font-body text-sm font-medium transition"
          >
            <Video class="w-4 h-4" />
            Entrar na sessão
          </a>

          <p
            v-else-if="profile?.next_session && !profile?.google_meet_link"
            class="font-body text-sm text-muted-foreground italic"
          >
            Link do Google Meet não configurado.
          </p>
        </div>

        <!-- ================= NOTAS PRIVADAS ================= -->
        <div class="border border-border/50 rounded-xl p-6 bg-card">
          <div class="flex items-center gap-3 mb-5">
            <FileText class="w-5 h-5 text-primary" />
            <h3 class="font-display text-xl text-foreground">
              Minhas Anotações
            </h3>
            <span class="ml-auto font-body text-xs text-muted-foreground italic">
              Visíveis apenas para você
            </span>
          </div>

          <textarea
            v-model="newNote"
            rows="3"
            placeholder="Escreva algo importante sobre seu processo..."
            class="w-full border border-border/50 rounded-lg p-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none bg-background"
          ></textarea>

          <button
            @click="saveNote"
            :disabled="!newNote.trim() || savingNote"
            class="mt-3 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-body text-sm font-medium hover:bg-primary/90 disabled:opacity-40 transition"
          >
            {{ savingNote ? "Salvando..." : "Salvar anotação" }}
          </button>

          <!-- Histórico -->
          <div v-if="notes.length" class="mt-6 border-t border-border/30 pt-4 space-y-3">
            <div
              v-for="note in notes"
              :key="note.id"
              class="border border-border/20 rounded-lg p-3 group relative"
            >
              <div class="flex items-center justify-between mb-1">
                <p class="text-xs text-muted-foreground font-body">
                  {{ formatDate(note.created_at) }}
                </p>
                <button
                  @click="removeNote(note.id)"
                  class="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 transition"
                >
                  <Trash2 class="w-3.5 h-3.5 text-destructive" />
                </button>
              </div>

              <p class="text-sm text-foreground font-body leading-relaxed">
                {{ note.content }}
              </p>
            </div>
          </div>

          <div v-else class="mt-4 text-sm text-muted-foreground font-body">
            Nenhuma anotação ainda.
          </div>
        </div>

      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import {
  LogOut,
  Calendar as CalendarIcon,
  AlertCircle,
  Clock,
  Video,
  FileText,
  CheckCircle,
  Trash2,
} from "lucide-vue-next";
import NavBar from "@/components/NavBar.vue";
import { format, parseISO, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  getClientDashboard,
  type ClientDashboardData,
} from "@/services/dashboard";

const router = useRouter();
const { user, logout } = useAuth();

const handleLogout = () => {
  logout();
  router.push("/login");
};

const todayFormatted = computed(() =>
  format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR }),
);

function formatDate(iso: string) {
  return format(parseISO(iso), "dd MMM yyyy", { locale: ptBR });
}

function formatNextDate(iso: string) {
  return format(parseISO(iso), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
}

const profile = ref<ClientDashboardData | null>(null);
const notes = ref<PatientNote[]>([]);
const isLoading = ref(true);

const canJoinSession = computed(() => {
  if (!profile.value?.next_session) return false;
  if (!profile.value.google_meet_link) return false;
  return isToday(parseISO(profile.value.next_session.date));
});

async function loadData() {
  isLoading.value = true;
  try {
    const [dashData, notesData] = await Promise.all([
      getClientDashboard(),
      getPatientNotes(),
    ]);
    profile.value = dashData;
    notes.value = notesData;
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadData);

const newNote = ref("");
const savingNote = ref(false);

async function saveNote() {
  if (!newNote.value.trim() || savingNote.value) return;

  savingNote.value = true;
  try {
    const note = await createPatientNote(newNote.value.trim());
    notes.value.unshift(note);
    newNote.value = "";
  } finally {
    savingNote.value = false;
  }
}

async function removeNote(id: number) {
  await deletePatientNote(id);
  notes.value = notes.value.filter((n) => n.id !== id);
}
</script>