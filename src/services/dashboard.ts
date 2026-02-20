import api from "./api";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface ClinicalNote {
  id: number;
  content: string;
  date: string | null;
  created_at: string;
}

export interface PatientUser {
  id: number;
  name: string;
  email: string;
  google_meet_link: string | null;
  created_at: string;
  sessions_per_week: number;
  session_days: string[];
  session_time: string | null;
  completed_sessions: number;
  absent_sessions: number;
  clinical_notes: ClinicalNote[];
}

export interface TherapistStats {
  active_clients: number;
  today_sessions: number;
  sessions_this_week: number;
}

export interface TherapistDashboardData {
  clients: PatientUser[];
  stats: TherapistStats;
}

export interface NextSession {
  date: string;
  time: string | null;
  weekday: string;
}

export interface ClientDashboardData {
  name: string;
  email: string;
  phone: string | null;
  google_meet_link: string | null;
  completed_sessions: number;
  absent_sessions: number;
  next_session: NextSession | null;
}

export interface PatientNote {
  id: number;
  content: string;
  created_at: string;
}

export interface CreatePatientParams {
  name: string;
  email: string;
  google_meet_link?: string;
  sessions_per_week?: number;
  weekdays?: string[];
  session_time?: string;
}

// ─── API calls – Terapeuta ────────────────────────────────────────────────

export async function getTherapistDashboard(): Promise<TherapistDashboardData> {
  const { data } = await api.get<TherapistDashboardData>("/therapists/dashboard");
  return data;
}

export async function getPatients(): Promise<PatientUser[]> {
  const { data } = await api.get<PatientUser[]>("/therapists/patients");
  return data;
}

export async function createPatient(params: CreatePatientParams): Promise<PatientUser> {
  const { data } = await api.post<PatientUser>("/therapists/patients", params);
  return data;
}

export async function updatePatient(id: number, params: CreatePatientParams): Promise<PatientUser> {
  const { data } = await api.put<PatientUser>(`/therapists/patients/${id}`, params);
  return data;
}

export async function deletePatient(id: number): Promise<void> {
  await api.delete(`/therapists/patients/${id}`);
}

export async function createClinicalNote(
  patientId: number,
  content: string,
): Promise<ClinicalNote> {
  const { data } = await api.post<ClinicalNote>(
    `/therapists/patients/${patientId}/notes`,
    { content },
  );
  return data;
}

// ─── API calls – Paciente ─────────────────────────────────────────────────

export async function getClientDashboard(): Promise<ClientDashboardData> {
  const { data } = await api.get<ClientDashboardData>("/clients/dashboard");
  return data;
}

export async function getPatientNotes(): Promise<PatientNote[]> {
  const { data } = await api.get<PatientNote[]>("/clients/patient_notes");
  return data;
}

export async function createPatientNote(content: string): Promise<PatientNote> {
  const { data } = await api.post<PatientNote>("/clients/patient_notes", { content });
  return data;
}

export async function deletePatientNote(id: number): Promise<void> {
  await api.delete(`/clients/patient_notes/${id}`);
}
