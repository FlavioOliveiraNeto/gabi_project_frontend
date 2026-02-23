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
      <!-- Header -->
      <div class="sm:flex sm:justify-between sm:items-center my-6">
        <h2 class="font-display text-2xl text-primary">
          Olá, {{ user?.name ?? "Terapeuta" }}!
        </h2>
        <p class="font-body text-sm text-muted-foreground">
          {{ todayFormatted }}
        </p>
      </div>

      <!-- Stats -->
      <DashboardStats :stats="stats" />

      <!-- Calendar -->
      <DashboardCalendar
        :sessions="calendarSessions"
        :patients="patients"
        @edit-patient="handleEditFromCalendar"
        @load-dashboard="loadDashboard"
      />

      <!-- Patients -->
      <PatientList
        :patients="patients"
        :is-loading="isLoading"
        @add="openCreateModal"
        @edit="openEditModal"
        @delete="confirmDelete"
        @note-saved="handleNoteSaved"
      />
    </main>

    <!-- Create/Edit Modal -->
    <PatientFormModal
      :is-open="showFormModal"
      :patient-to-edit="editingPatient"
      @close="closeFormModal"
      @saved="handlePatientSaved"
    />

    <!-- Delete Modal -->
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
  type CalendarSession,
  type PatientUser,
  type TherapistStats,
} from "@/services/dashboard";

/* ---------------------------
   Auth
---------------------------- */
const router = useRouter();
const { user, logout } = useAuth();

const handleLogout = () => {
  logout();
  router.push("/login");
};

/* ---------------------------
   Date
---------------------------- */
const todayFormatted = computed(() =>
  format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR }),
);

/* ---------------------------
   State
---------------------------- */
const patients = ref<PatientUser[]>([]);
const calendarSessions = ref<CalendarSession[]>([]);

const stats = ref<TherapistStats>({
  active_clients: 0,
  sessions_today: 0,
  sessions_this_week: 0,
  sessions_completed_this_week: 0,
});

const isLoading = ref(true);

/* ---------------------------
   Load Dashboard
---------------------------- */
async function loadDashboard() {
  isLoading.value = true;
  try {
    const response = await getTherapistDashboard();

    stats.value = response.stats;
    calendarSessions.value = response.calendar_sessions ?? [];
    patients.value = response.patients ?? [];
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadDashboard);

/* ---------------------------
   Form Modal
---------------------------- */
const showFormModal = ref(false);
const editingPatient = ref<PatientUser | null>(null);

function openCreateModal() {
  editingPatient.value = null;
  showFormModal.value = true;
}

function openEditModal(patient: PatientUser) {
  console.log(patient);
  editingPatient.value = patient;
  showFormModal.value = true;
}

function closeFormModal() {
  showFormModal.value = false;
  editingPatient.value = null;
}

async function handlePatientSaved(patient: PatientUser, isNew: boolean) {
  await loadDashboard();
}

function handleEditFromCalendar(patientId: number) {
  const patient = patients.value.find((p) => p.id === patientId);
  if (patient) {
    openEditModal(patient);
  }
}

/* ---------------------------
   Delete Modal
---------------------------- */
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

async function handlePatientDeleted(patientId: number) {
  await loadDashboard();
}

/* ---------------------------
   Notes Update
---------------------------- */
function handleNoteSaved(patientId: number, note: any) {
  const patient = patients.value.find((p) => p.id === patientId);
  if (patient) {
    patient.clinical_notes.unshift(note);
  }
}
</script>
