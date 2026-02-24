import api from "./api";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface ClinicalNote {
  id: number;
  content: string;
  date: string | null;
  created_at: string;
}

export interface SingleSession {
  id: number;
  date: string;
  time: string;
  status: string;
}

export interface PatientUser {
  id: number;
  name: string;
  email: string;
  google_meet_link: string | null;
  created_at?: string;
  schedule_type?: "weekly" | "single" | null;
  sessions_per_week: number;
  session_days: string[];
  session_time: string | null;
  single_sessions?: SingleSession[];
  completed_sessions: number;
  absent_sessions: number;
  clinical_notes: ClinicalNote[];
}

export interface TherapistStats {
  active_clients: number;
  sessions_today: number;
  sessions_this_week: number;
  sessions_completed_this_week: number;
}

export interface TherapistDashboardData {
  stats: TherapistStats;
  patients: PatientUser[];
  calendar_sessions: CalendarSession[];
}

export interface NextSession {
  date: string;
  time: string | null;
}

export interface ClientDashboardData {
  profile: {
    name: string;
    email: string;
    phone: string | null;
    google_meet_link: string | null;
  };
  stats: {
    completed_sessions: number;
    absent_sessions: number;
  };
  next_session: {
    id: number;
    date: string;
    time: string | null;
    weekday: string;
    session_type: string;
    status: string;
  } | null;
  notes: PatientNote[];
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

export interface CalendarSession {
  id: number;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "absent" | "cancelled";
  patient: {
    id: number;
    name: string;
    google_meet_link: string | null;
  };
}

export interface CreateSessionParams {
  patient_id: number;
  scheduled_at: string;
  session_type?: "regular" | "extra";
}

// ─── API calls – Terapeuta ────────────────────────────────────────────────

export async function getTherapistDashboard(): Promise<TherapistDashboardData> {
  const { data } = await api.get<TherapistDashboardData>(
    "/therapists/dashboard",
  );
  return data;
}

export async function getPatients(): Promise<PatientUser[]> {
  const { data } = await api.get<PatientUser[]>("/therapists/patients");
  return data;
}

export interface CreatePatientResponse extends PatientUser {
  generated_password: string;
}

export async function createPatient(
  params: CreatePatientParams,
): Promise<CreatePatientResponse> {
  const { data } = await api.post<CreatePatientResponse>("/therapists/patients", params);
  return data;
}

export async function updatePatient(
  id: number,
  params: CreatePatientParams,
): Promise<PatientUser> {
  const { data } = await api.put<PatientUser>(
    `/therapists/patients/${id}`,
    params,
  );
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

export async function updateClinicalNote(
  patientId: number,
  noteId: number,
  content: string,
): Promise<ClinicalNote> {
  const { data } = await api.patch<ClinicalNote>(
    `/therapists/patients/${patientId}/notes/${noteId}`,
    { content },
  );
  return data;
}

export async function deleteClinicalNote(
  patientId: number,
  noteId: number,
): Promise<void> {
  await api.delete(`/therapists/patients/${patientId}/notes/${noteId}`);
}

export async function updateSessionStatus(
  sessionId: number,
  status: "scheduled" | "completed" | "absent",
): Promise<CalendarSession> {
  const { data } = await api.patch<CalendarSession>(
    `/therapists/sessions/${sessionId}`,
    { status },
  );
  return data;
}

export async function createSession(
  params: CreateSessionParams,
): Promise<CalendarSession> {
  const { data } = await api.post<CalendarSession>(
    "/therapists/sessions",
    params,
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
  const { data } = await api.post<PatientNote>("/clients/patient_notes", {
    content,
  });
  return data;
}

export async function updatePatientNote(
  id: number,
  content: string,
): Promise<PatientNote> {
  const { data } = await api.patch<PatientNote>(`/clients/patient_notes/${id}`, {
    content,
  });
  return data;
}

export async function deletePatientNote(id: number): Promise<void> {
  await api.delete(`/clients/patient_notes/${id}`);
}
