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
      <div
        class="grid gap-4 justify-items-center sm:flex sm:justify-between sm:items-center my-6"
      >
        <div class="flex items-end gap-6">
          <div class="flex flex-col items-center gap-4">
            <div class="relative">
              <img
                :src="profileImage || defaultAvatar"
                class="w-24 h-24 rounded-full object-cover border border-border"
              />
              <label
                class="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1.5 rounded-full cursor-pointer"
              >
                <Camera class="w-4 h-4" />
                <input
                  type="file"
                  class="hidden"
                  accept="image/*"
                  @change="handleImageUpload"
                />
              </label>
            </div>
          </div>
          <h2 class="font-display text-2xl text-primary mb-4">
            Olá, {{ user ? user?.name : "Usuário" }}!
          </h2>
        </div>
        <p class="font-body text-sm text-muted-foreground">
          {{ todayFormatted }}
        </p>
      </div>

      <!-- STATS -->
      <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 mb-8">
        <!-- Próxima sessão -->
        <div
          class="border border-border/50 rounded-xl p-5 bg-card flex flex-col gap-3"
        >
          <div class="flex items-center gap-2">
            <div class="p-2 rounded-lg bg-primary/10">
              <CalendarIcon class="w-4 h-4 text-primary" />
            </div>
            <h3 class="font-body text-sm text-muted-foreground">
              Próxima Sessão
            </h3>
          </div>
          <div>
            <p class="font-display text-lg text-foreground">
              {{ nextSession.date }}
            </p>
            <p class="font-body text-sm text-primary font-semibold">
              {{ nextSession.time }}
            </p>
          </div>
        </div>

        <!-- Faltas -->
        <div
          class="border border-border/50 rounded-xl p-5 bg-card flex flex-col gap-3"
        >
          <div class="flex items-center gap-2">
            <div class="p-2 rounded-lg bg-secondary/10">
              <AlertCircle class="w-4 h-4 text-secondary" />
            </div>
            <h3 class="font-body text-sm text-muted-foreground">
              Faltas acumuladas
            </h3>
          </div>
          <div>
            <p class="font-display text-3xl text-foreground">
              {{ absences }}
            </p>
          </div>
        </div>
      </div>

      <!-- MAIN GRID -->
      <div class="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <!-- LEFT: Sessão -->
        <div
          class="lg:col-span-2 border border-border/50 rounded-xl p-6 bg-card space-y-4"
        >
          <div class="flex items-center gap-3">
            <Clock class="w-5 h-5 text-primary" />
            <h3 class="font-display text-xl text-foreground">
              Detalhes da Sessão
            </h3>
          </div>

          <div class="space-y-2">
            <p class="font-body text-sm text-muted-foreground">
              Data:
              <span class="text-foreground font-medium">
                {{ nextSession.date }}
              </span>
            </p>

            <p class="font-body text-sm text-muted-foreground">
              Horário:
              <span class="text-foreground font-medium">
                {{ nextSession.time }}
              </span>
            </p>
          </div>

          <a
            :href="nextSession.meetLink"
            target="_blank"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/10 hover:bg-secondary/20 text-secondary font-body text-sm font-medium transition"
          >
            <Video class="w-4 h-4" />
            Entrar na sessão (Google Meet)
          </a>
        </div>
      </div>

      <!-- NOTAS -->
      <div class="mt-8 border border-border/50 rounded-xl p-6 bg-card">
        <div class="flex items-center gap-3 mb-5">
          <FileText class="w-5 h-5 text-primary" />
          <h3 class="font-display text-xl text-foreground">Minhas Anotações</h3>
        </div>

        <textarea
          v-model="newNote"
          rows="3"
          placeholder="Escreva algo importante sobre seu processo..."
          class="w-full border border-border/50 rounded-lg p-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
        ></textarea>

        <button
          @click="saveNote"
          :disabled="!newNote.trim()"
          class="mt-3 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-body text-sm font-medium hover:bg-primary/90 disabled:opacity-40 transition"
        >
          Salvar anotação
        </button>

        <!-- Histórico -->
        <div
          v-if="notes.length"
          class="mt-6 border-t border-border/30 pt-4 space-y-4"
        >
          <div
            v-for="note in notes"
            :key="note.id"
            class="border border-border/20 rounded-lg p-3"
          >
            <p class="text-xs text-muted-foreground mb-1">
              {{ note.date }}
            </p>
            <p class="text-sm text-foreground">
              {{ note.content }}
            </p>
          </div>
        </div>

        <div v-else class="mt-4 text-sm text-muted-foreground">
          Nenhuma anotação ainda.
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import {
  LogOut,
  Calendar as CalendarIcon,
  AlertCircle,
  Clock,
  Video,
  FileText,
  User,
  Camera,
} from "lucide-vue-next";
import NavBar from "@/components/NavBar.vue";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const router = useRouter();
const { user, logout } = useAuth();

const handleLogout = () => {
  logout();
  router.push("/login");
};

const todayFormatted = computed(() =>
  format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR }),
);

// Mock data
const nextSession = {
  date: "25 de Fevereiro de 2026",
  time: "15:30",
  meetLink: "https://meet.google.com",
};

const absences = 2;

// Notas privadas
const notes = ref<{ id: number; date: string; content: string }[]>([]);
const newNote = ref("");

function saveNote() {
  if (!newNote.value.trim()) return;

  notes.value.unshift({
    id: Date.now(),
    date: format(new Date(), "dd MMM yyyy", { locale: ptBR }),
    content: newNote.value,
  });

  newNote.value = "";
}

// Foto perfil
const profileImage = ref<string | null>(null);
const defaultAvatar =
  "https://ui-avatars.com/api/?background=E9D8FD&color=6B21A8&name=User";

function handleImageUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    profileImage.value = reader.result as string;
  };
  reader.readAsDataURL(file);
}
</script>
