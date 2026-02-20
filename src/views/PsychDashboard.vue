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

    <main class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-24 pb-12">
      <div class="sm:flex sm:justify-between sm:items-center my-6">
        <h2 class="font-display text-2xl text-primary">
          Olá, {{ user?.name ?? "Terapeuta" }}!
        </h2>
        <p class="font-body text-sm text-muted-foreground">
          {{ todayFormatted }}
        </p>
      </div>

      <DashboardStats :stats="stats" />

      <DashboardCalendar :patients="patients" />

      <PatientList
        :patients="patients"
        :is-loading="isLoading"
        @add="openCreateModal"
        @edit="openEditModal"
        @delete="confirmDelete"
        @note-saved="handleNoteSaved"
      />
    </main>

    <PatientFormModal
      :is-open="showFormModal"
      :patient-to-edit="editingPatient"
      @close="closeFormModal"
      @saved="handlePatientSaved"
    />

    <ConfirmDeleteModal
      :is-open="showDeleteModal"
      :target="deleteTarget"
      @close="closeDeleteModal"
      @deleted="handlePatientDeleted"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { LogOut } from "lucide-vue-next";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import NavBar from "@/components/NavBar.vue";
import DashboardStats from "@/components/dashboard/DashboardStats.vue";
import DashboardCalendar from "@/components/dashboard/DashboardCalendar.vue";
import PatientList from "@/components/dashboard/PatientList.vue";
import PatientFormModal from "@/components/dashboard/modals/PatientFormModal.vue";
import ConfirmDeleteModal from "@/components/dashboard/modals/ConfirmDeleteModal.vue";

import {
  getTherapistDashboard,
  type PatientUser,
  type TherapistStats,
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
    // silently ignore
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadDashboard);

// Form Modal State
const showFormModal = ref(false);
const editingPatient = ref<PatientUser | null>(null);

function openCreateModal() {
  editingPatient.value = null;
  showFormModal.value = true;
}

function openEditModal(patient: PatientUser) {
  editingPatient.value = patient;
  showFormModal.value = true;
}

function closeFormModal() {
  showFormModal.value = false;
  editingPatient.value = null;
}

function handlePatientSaved(patient: PatientUser, isNew: boolean) {
  if (isNew) {
    patients.value.unshift(patient);
    stats.value.active_clients += 1;
  } else {
    const idx = patients.value.findIndex((p) => p.id === patient.id);
    if (idx !== -1) patients.value[idx] = patient;
  }
}

// Delete Modal State
const showDeleteModal = ref(false);
const deleteTarget = ref<PatientUser | null>(null);

function confirmDelete(patient: PatientUser) {
  deleteTarget.value = patient;
  showDeleteModal.value = true;
}

function closeDeleteModal() {
  showDeleteModal.value = false;
  deleteTarget.value = null;
}

function handlePatientDeleted(patientId: number) {
  patients.value = patients.value.filter((p) => p.id !== patientId);
  stats.value.active_clients = Math.max(0, stats.value.active_clients - 1);
}

// Notes Update
function handleNoteSaved(patientId: number, note: any) {
  const patient = patients.value.find((p) => p.id === patientId);
  if (patient) {
    patient.clinical_notes.unshift(note);
  }
}
</script>
