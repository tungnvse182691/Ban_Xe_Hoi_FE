import type { Appointment, ApptStatus } from '@/types/Appointment';

const KEY = 'tommycar_appointments';

export function getAppointments(): Appointment[] {
  try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
}
export function saveAppointments(list: Appointment[]) { localStorage.setItem(KEY, JSON.stringify(list)); }
export function createAppointment(a: Omit<Appointment, 'id'|'createdAt'|'status'> & {status?: ApptStatus}): Appointment {
  const cur = getAppointments();
  const appt: Appointment = { id: `ap-${Date.now()}`, createdAt: new Date().toISOString(), status: 'Pending', ...a };
  saveAppointments([appt, ...cur]);
  return appt;
}
export function updateAppointmentStatus(id: string, status: ApptStatus) {
  const cur = getAppointments();
  const idx = cur.findIndex(c=>c.id===id);
  if(idx>=0){ cur[idx].status=status; saveAppointments(cur); }
}
