import { Incident, DisasterRecoveryIncident, Responder } from '@/types';
import { mockIncidents } from '@/data/incidents';
import { realWorldDisasters } from '@/data/realWorldDisasters';
import { mockResponders } from '@/data/responders';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api').replace(/\/$/, '');

// Helper for fetch with timeout
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 2000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

// 1. Backend Connectivity & Health Check
export const healthApi = {
  async check(): Promise<{ online: boolean; message: string; timestamp?: string }> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/health`, {}, 1500);
      if (res.ok) {
        const data = await res.json();
        return { online: true, message: data.message || 'Connected to Backend API', timestamp: data.timestamp };
      }
      return { online: false, message: `Backend returned status ${res.status}` };
    } catch {
      return { online: false, message: 'Backend server offline (running in resilient local mode)' };
    }
  },
};

// 2. Incidents API (with graceful fallback to mock data)
export const incidentsApi = {
  async getAll(params?: { priority?: string; type?: string; status?: string }): Promise<Incident[]> {
    try {
      const query = new URLSearchParams();
      if (params?.priority && params.priority !== 'all') query.set('priority', params.priority);
      if (params?.type && params.type !== 'all') query.set('type', params.type);
      if (params?.status && params.status !== 'all') query.set('status', params.status);

      const qs = query.toString() ? `?${query.toString()}` : '';
      const res = await fetchWithTimeout(`${API_BASE_URL}/incidents${qs}`);
      if (res.ok) {
        const data = await res.json();
        return data.incidents || data;
      }
    } catch {
      // Fallback to local mock data
    }

    return mockIncidents.filter((inc) => {
      if (params?.priority && params.priority !== 'all' && inc.priority !== params.priority) return false;
      if (params?.type && params.type !== 'all' && inc.disasterType !== params.type) return false;
      if (params?.status && params.status !== 'all' && inc.status !== params.status) return false;
      return true;
    });
  },

  async getById(id: string): Promise<Incident | null> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/incidents/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return mockIncidents.find((i) => i.id === id || i.trackingId === id) || null;
  },

  async create(incident: Partial<Incident>): Promise<Incident> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/incidents`, {
        method: 'POST',
        body: JSON.stringify(incident),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const defaultLoc = {
      latitude: incident.lat || 22.0,
      longitude: incident.lng || 78.0,
      accuracy: 10,
      area: incident.location?.area || 'Reported Crisis Sector',
      landmark: incident.location?.landmark || '',
      simulated: false,
    };

    // Create local object conforming to Incident interface
    const created: Incident = {
      id: incident.id || `inc-${Date.now()}`,
      trackingId: incident.trackingId || `DS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title: incident.title || 'Emergency Incident Report',
      description: incident.description || '',
      disasterType: incident.disasterType || 'other',
      priority: incident.priority || 'medium',
      status: incident.status || 'active',
      location: incident.location || defaultLoc,
      peopleAffected: incident.peopleAffected || 1,
      injured: incident.injured || 0,
      trapped: incident.trapped || 0,
      respondersAssigned: incident.respondersAssigned || [],
      imageUrl: incident.imageUrl,
      lat: incident.lat ?? (incident.location?.latitude || defaultLoc.latitude),
      lng: incident.lng ?? (incident.location?.longitude || defaultLoc.longitude),
      createdAt: incident.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return created;
  },

  async updateStatus(id: string, status: string): Promise<{ success: boolean; id: string; status: string }> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/incidents/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return { success: true, id, status };
  },
};

// 3. Disaster News Portal API (with fallback to realWorldDisasters)
export const newsApi = {
  async getAll(category?: string): Promise<DisasterRecoveryIncident[]> {
    try {
      const query = category && category !== 'all' ? `?category=${category}` : '';
      const res = await fetchWithTimeout(`${API_BASE_URL}/news${query}`);
      if (res.ok) {
        const data = await res.json();
        return data.news || data;
      }
    } catch {
      // Fallback
    }

    if (!category || category === 'all') return realWorldDisasters;
    return realWorldDisasters.filter((item) => item.type === category);
  },

  async getById(id: string): Promise<DisasterRecoveryIncident | null> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/news/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return realWorldDisasters.find((item) => item.id === id) || null;
  },

  async create(newsItem: Partial<DisasterRecoveryIncident>): Promise<DisasterRecoveryIncident> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/news`, {
        method: 'POST',
        body: JSON.stringify(newsItem),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const created: DisasterRecoveryIncident = {
      id: newsItem.id || `news-${Date.now()}`,
      title: newsItem.title || 'Emergency News Dispatch',
      hindiTitle: newsItem.hindiTitle || 'आपदा समाचार बुलेटिन',
      location: newsItem.location || 'Active Disaster Sector',
      state: newsItem.state || 'National Disaster Zone',
      date: newsItem.date || new Date().toISOString().split('T')[0],
      type: newsItem.type || 'flood',
      imageUrl: newsItem.imageUrl || 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
      imageCaption: newsItem.imageCaption || 'Ground relief operations underway',
      secondaryImageUrl: newsItem.secondaryImageUrl,
      secondaryImageCaption: newsItem.secondaryImageCaption,
      fallbackImageUrl: newsItem.fallbackImageUrl,
      description: newsItem.description || '',
      peopleAffected: newsItem.peopleAffected || 0,
      peopleRescued: newsItem.peopleRescued || 0,
      reliefEfficiency: newsItem.reliefEfficiency || 95.0,
      fatalitiesPrevented: newsItem.fatalitiesPrevented || 0,
      recoveryStage: newsItem.recoveryStage || 'Active Search & Evacuation',
      keyDeployments: newsItem.keyDeployments || ['Rapid Emergency Task Force', 'Local Volunteer Battalion'],
      operationalSummary: newsItem.operationalSummary || 'Multi-agency crisis response squads mobilized for rapid evacuation and relief aid.',
    };
    return created;
  },
};

// 4. Responders API
export const respondersApi = {
  async getAll(): Promise<Responder[]> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/responders`);
      if (res.ok) {
        const data = await res.json();
        return data.responders || data;
      }
    } catch {
      // Fallback
    }
    return mockResponders;
  },

  async dispatch(incidentId: string, responderId: string): Promise<{ success: boolean; dispatchId: string }> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/dispatch`, {
        method: 'POST',
        body: JSON.stringify({ incidentId, responderId }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return { success: true, dispatchId: `DISP-${Date.now()}` };
  },
};
