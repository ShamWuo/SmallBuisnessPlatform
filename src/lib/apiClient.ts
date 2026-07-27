const API_BASE = 'http://localhost:3001/api';

export async function fetchAppointmentsFromAPI() {
  try {
    const res = await fetch(`${API_BASE}/appointments`);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function createAppointmentAPI(aptData: any) {
  try {
    const res = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(aptData)
    });
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function fetchStaffFromAPI() {
  try {
    const res = await fetch(`${API_BASE}/staff`);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function fetchCustomersFromAPI() {
  try {
    const res = await fetch(`${API_BASE}/customers`);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function fetchCampaignsFromAPI() {
  try {
    const res = await fetch(`${API_BASE}/campaigns`);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function createCampaignAPI(campaignData: any) {
  try {
    const res = await fetch(`${API_BASE}/campaigns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campaignData)
    });
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function sendCopilotAIQueryAPI(prompt: string) {
  try {
    const res = await fetch(`${API_BASE}/copilot/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

