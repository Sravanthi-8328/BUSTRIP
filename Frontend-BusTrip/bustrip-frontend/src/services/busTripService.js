const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081').replace(/\/$/, '');

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let detail = '';
    try {
      const body = await response.json();
      detail = body.message || body.error || '';
    } catch {
      // Some Spring errors return an empty or non-JSON body.
    }
    throw new Error(detail || `Request failed (${response.status})`);
  }

  if (response.status === 204) return null;
  return response.json();
}

function normalizeTrip(trip) {
  return {
    ...trip,
    id: trip.id,
    routeName: trip.routeName || '',
    travelDate: trip.travelDate || '',
    passengerCount: Number(trip.passengerCount || 0),
    delayed: Boolean(trip.delayed),
  };
}

function normalizeTrips(data) {
  const list = Array.isArray(data) ? data : data?.content || [];
  return list.map(normalizeTrip);
}

export async function getAllTrips() {
  return normalizeTrips(await request('/displayall'));
}

export async function getTrip(id) {
  return normalizeTrip(await request(`/${encodeURIComponent(id)}`));
}

export async function searchTrips(routeName) {
  return normalizeTrips(await request(`/route/${encodeURIComponent(routeName)}`));
}

export async function getDelayedTrips() {
  return normalizeTrips(await request('/delayed'));
}

export async function addTrip(trip) {
  return normalizeTrip(await request('/add', { method: 'POST', body: JSON.stringify(trip) }));
}

export async function updateTrip(id, trip) {
  return normalizeTrip(await request(`/update/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(trip),
  }));
}

export async function deleteTrip(id) {
  return request(`/delete/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
