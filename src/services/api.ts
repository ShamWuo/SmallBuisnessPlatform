import type { Appointment, StaffMember, HealthSafetyLog } from '../types';

const API_BASE_URL = '/api';

/**
 * Check backend server connectivity
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) return false;
    const data = await res.json();
    return data.status === 'ok';
  } catch (err) {
    console.warn('Backend server unreachable, operating in local fallback mode.');
    return false;
  }
}

/**
 * Fetch all appointments from backend
 */
export async function fetchAppointmentsApi(): Promise<Appointment[] | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/appointments`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

/**
 * Create a new appointment on backend
 */
export async function createAppointmentApi(
  aptData: Omit<Appointment, 'id' | 'clientHistory'> & { totalVisits?: number; pastNoShows?: number; pastCancellations?: number }
): Promise<Appointment | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(aptData)
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

/**
 * Fetch compliance data (staff list + health logs) from backend
 */
export async function fetchComplianceApi(): Promise<{ staffList: StaffMember[]; healthLogs: HealthSafetyLog[] } | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/compliance`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

/**
 * Add staff license on backend
 */
export async function createLicenseApi(licenseData: {
  staffId: string;
  title: string;
  category?: string;
  expiryDate: string;
  licenseNumber?: string;
}): Promise<any | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/staff/licenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(licenseData)
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

/**
 * Add health safety log on backend
 */
export async function createComplianceLogApi(logData: {
  title: string;
  category?: string;
  expiryDate: string;
  responsibleStaff?: string;
}): Promise<HealthSafetyLog | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/compliance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logData)
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}
