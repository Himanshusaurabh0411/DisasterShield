/**
 * DisasterShield Emergency Backend API Server
 * Built with standard Node.js HTTP module using modern ES Module imports.
 * Run with: node server/server.js
 */

import http from 'node:http';
import url from 'node:url';

const PORT = process.env.PORT || 5001;

// In-Memory Data Store (pre-populated with realistic disaster data)
let incidents = [
  {
    id: 'inc-1',
    trackingId: 'DS-2026-8921',
    title: 'Severe Flash Flooding & Inundation in Low-Lying Sector 4',
    description: 'Rapid water accumulation following 140mm rainfall in 3 hours. Ground floor apartments submerged, 12 residents stranded on rooftops.',
    disasterType: 'flood',
    priority: 'critical',
    location: {
      latitude: 19.0760,
      longitude: 72.8777,
      accuracy: 8,
      area: 'Kurla West, Mumbai, Maharashtra',
      landmark: 'Near Mithi River Basin Gate 3',
    },
    peopleAffected: 35,
    injured: 3,
    trapped: 12,
    mediaFiles: ['https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80'],
    contactPhone: '+91-98200-11223',
    status: 'dispatched',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    aiScore: {
      credibility: 96,
      urgency: 'critical',
      duplicateProbability: 2,
      recommendedPriority: 'critical',
    },
  },
  {
    id: 'inc-2',
    trackingId: 'DS-2026-4412',
    title: 'Major Hillside Mudslide Blocking Main Valley Arterial Road',
    description: 'Heavy debris flow severed connectivity between uphill villages. Electricity poles downed, minor damage to perimeter walls.',
    disasterType: 'landslide',
    priority: 'high',
    location: {
      latitude: 31.1048,
      longitude: 77.1734,
      accuracy: 12,
      area: 'Shimla Bypass Sector 2, Himachal Pradesh',
      landmark: 'KM 14 Mountain Road Bend',
    },
    peopleAffected: 80,
    injured: 2,
    trapped: 0,
    mediaFiles: ['https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'],
    contactPhone: '+91-98160-55443',
    status: 'verified',
    createdAt: new Date(Date.now() - 1000 * 60 * 85).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    aiScore: {
      credibility: 91,
      urgency: 'high',
      duplicateProbability: 4,
      recommendedPriority: 'high',
    },
  },
  {
    id: 'inc-3',
    trackingId: 'DS-2026-3108',
    title: 'Coastal Surge Breach Near Fishing Settlement',
    description: 'High tidal surge breached sand bunds. Seawater entering 45 thatched dwellings. Community evacuation underway.',
    disasterType: 'cyclone',
    priority: 'critical',
    location: {
      latitude: 20.2961,
      longitude: 85.8245,
      accuracy: 15,
      area: 'Dhamra Port Coastal Village, Bhadrak, Odisha',
      landmark: 'South Embankment Post 4',
    },
    peopleAffected: 210,
    injured: 4,
    trapped: 8,
    mediaFiles: ['https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=800&q=80'],
    contactPhone: '+91-94370-99881',
    status: 'in_progress',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    aiScore: {
      credibility: 98,
      urgency: 'critical',
      duplicateProbability: 1,
      recommendedPriority: 'critical',
    },
  },
];

let newsArticles = [
  {
    id: 'news-wayanad-2024',
    title: 'Wayanad Landslides 2024: Recovery & Bailey Bridge Construction',
    location: 'Chooralmala & Meppadi, Wayanad, Kerala',
    date: 'July - August 2024',
    type: 'landslide',
    severity: 'critical',
    peopleAffected: 450,
    peopleRescued: 380,
    description: 'Massive twin landslides struck Chooralmala and Mundakkai following 300+ mm monsoon downpours. Coordinated search and rescue units constructed a 190-foot Bailey bridge within 31 hours across raging river waters, establishing critical vehicle access and rescuing hundreds of cut-off residents.',
    keyActions: [
      'Rapid construction of 190-foot Class 24 Bailey bridge across Iruvaipuzha river.',
      'Deployment of advanced Ground Penetrating Radar (GPR) and thermal imaging drones.',
      'Airdropping 2,800+ food and medical kits via transport helicopters.',
    ],
    deployedAgencies: [
      'Urban Search & Rescue Specialists (120+ personnel)',
      'Tactical Engineering Relief Sappers',
      'Regional Emergency Relief Squads',
      'Local Volunteer Disaster Response Network'
    ],
    primaryImage: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1200&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
    source: 'DisasterShield Ground Intel & Multi-Agency Situation Reports',
  },
  {
    id: 'news-vijayawada-2024',
    title: 'Vijayawada Krishna Floods & Budameru Rivulet Breach 2024',
    location: 'Ajit Singh Nagar & Krishna Basin, Vijayawada, Andhra Pradesh',
    date: 'September 2024',
    type: 'flood',
    severity: 'critical',
    peopleAffected: 600000,
    peopleRescued: 450000,
    description: 'Prakasam Barrage recorded an unprecedented 11.43 lakh cusecs discharge as the Budameru rivulet breached at three critical points. Powerboats, amphibious transports, and volunteer teams evacuated over 450,000 citizens from inundated residential colonies.',
    keyActions: [
      'Mobilization of 48 motor powerboats and amphibious rescue vehicles.',
      'Airdrop of 500,000 food packets and clean drinking water sachets.',
      'Emergency reinforcement of 3 breaches on Budameru canal bund.',
    ],
    deployedAgencies: [
      'Marine & Flood Rescue Flotilla (32 boats)',
      'Community Aerial Rescue Squads',
      'Tactical Engineering Relief Sappers',
      'Regional Fire & Medical Corps'
    ],
    primaryImage: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=1200&q=80',
    source: 'State Relief Operations Desk & Aerial Telemetry',
  },
  {
    id: 'news-dana-2024',
    title: 'Severe Cyclone Dana: Zero-Casualty Evacuation Strategy',
    location: 'Dhamra & Bhadrak Coastline, Odisha / West Bengal',
    date: 'October 2024',
    type: 'cyclone',
    severity: 'high',
    peopleAffected: 800000,
    peopleRescued: 780000,
    description: 'Severe cyclonic storm Dana made landfall near Dhamra Port with sustained winds of 110-120 km/h. Comprehensive early warning and community evacuation protocols successfully relocated 780,000+ vulnerable coastal residents to cyclone shelters ahead of landfall.',
    keyActions: [
      'Pre-emptive evacuation of 780,000+ citizens to 6,000 cyclone shelters.',
      'Rapid clearing of 420+ arterial roads blocked by uprooted trees within 18 hours.',
      'Restoration of 85% electric grid feeder lines within 24 hours of landfall.',
    ],
    deployedAgencies: [
      'Coastal Disaster Rapid Units (28 teams)',
      'Emergency Fire & Rescue Squads',
      'Civil Defense Volunteers'
    ],
    primaryImage: 'https://images.unsplash.com/photo-1505672678474-c5a452ef34d8?auto=format&fit=crop&w=1200&q=80',
    source: 'Coastal Radar Meteorological Telemetry & Relief Command',
  },
];

let responders = [
  { id: 'resp-1', name: 'Rapid Urban Search & Rescue Team Alpha', type: 'search_rescue', status: 'available', location: 'Central Hub Base' },
  { id: 'resp-2', name: 'Emergency Flood Flotilla Unit 3', type: 'flood_rescue', status: 'deployed', location: 'Mithi River Basin' },
  { id: 'resp-3', name: 'Mobile Emergency Surgical Clinic', type: 'medical', status: 'available', location: 'Regional Medical Depot' },
  { id: 'resp-4', name: 'Aerial Evacuation Helicopter Squad', type: 'air_rescue', status: 'standby', location: 'Airport Hangar 2' },
];

// Helper: send JSON with CORS
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(data));
}

// Request Handler
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS Preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    return res.end();
  }

  // 1. Health check
  if (method === 'GET' && pathname === '/api/health') {
    return sendJson(res, 200, {
      status: 'ok',
      online: true,
      message: 'DisasterShield Emergency Backend Server Running',
      port: PORT,
      timestamp: new Date().toISOString(),
      stats: {
        incidentsCount: incidents.length,
        newsCount: newsArticles.length,
        respondersCount: responders.length,
      },
    });
  }

  // 2. Incidents Endpoints
  if (pathname === '/api/incidents' || pathname === '/api/incidents/') {
    if (method === 'GET') {
      const { priority, type, status } = parsedUrl.query;
      let filtered = [...incidents];
      if (priority && priority !== 'all') filtered = filtered.filter(i => i.priority === priority);
      if (type && type !== 'all') filtered = filtered.filter(i => i.disasterType === type);
      if (status && status !== 'all') filtered = filtered.filter(i => i.status === status);
      return sendJson(res, 200, { count: filtered.length, incidents: filtered });
    }

    if (method === 'POST') {
      let body = '';
      req.on('data', chunk => (body += chunk));
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          const newIncident = {
            id: `inc-${Date.now()}`,
            trackingId: `DS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            status: 'submitted',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...parsed,
          };
          incidents.unshift(newIncident);
          return sendJson(res, 201, newIncident);
        } catch (err) {
          return sendJson(res, 400, { error: 'Invalid JSON payload' });
        }
      });
      return;
    }
  }

  // Individual Incident by ID
  if (pathname.startsWith('/api/incidents/')) {
    const parts = pathname.split('/').filter(Boolean);
    const incidentId = parts[2];

    if (parts.length === 3 && method === 'GET') {
      const found = incidents.find(i => i.id === incidentId || i.trackingId === incidentId);
      if (!found) return sendJson(res, 404, { error: 'Incident not found' });
      return sendJson(res, 200, found);
    }

    // PATCH /api/incidents/:id/status
    if (parts.length === 4 && parts[3] === 'status' && method === 'PATCH') {
      let body = '';
      req.on('data', chunk => (body += chunk));
      req.on('end', () => {
        try {
          const { status } = JSON.parse(body);
          const found = incidents.find(i => i.id === incidentId || i.trackingId === incidentId);
          if (!found) return sendJson(res, 404, { error: 'Incident not found' });
          found.status = status;
          found.updatedAt = new Date().toISOString();
          return sendJson(res, 200, { success: true, incident: found });
        } catch (err) {
          return sendJson(res, 400, { error: 'Invalid JSON payload' });
        }
      });
      return;
    }
  }

  // 3. Disaster News Portal Endpoints
  if (pathname === '/api/news' || pathname === '/api/news/') {
    if (method === 'GET') {
      const { category, type } = parsedUrl.query;
      const cat = category || type;
      let filtered = [...newsArticles];
      if (cat && cat !== 'all') filtered = filtered.filter(n => n.type === cat);
      return sendJson(res, 200, { count: filtered.length, news: filtered });
    }

    if (method === 'POST') {
      let body = '';
      req.on('data', chunk => (body += chunk));
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          const newArticle = {
            id: `news-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            ...parsed,
          };
          newsArticles.unshift(newArticle);
          return sendJson(res, 201, newArticle);
        } catch (err) {
          return sendJson(res, 400, { error: 'Invalid JSON payload' });
        }
      });
      return;
    }
  }

  // Individual News by ID
  if (pathname.startsWith('/api/news/')) {
    const parts = pathname.split('/').filter(Boolean);
    const newsId = parts[2];
    if (parts.length === 3 && method === 'GET') {
      const found = newsArticles.find(n => n.id === newsId);
      if (!found) return sendJson(res, 404, { error: 'News article not found' });
      return sendJson(res, 200, found);
    }
  }

  // 4. Responders Endpoints
  if (pathname === '/api/responders' && method === 'GET') {
    return sendJson(res, 200, { responders });
  }

  if (pathname === '/api/dispatch' && method === 'POST') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      try {
        const { incidentId, responderId } = JSON.parse(body);
        return sendJson(res, 200, {
          success: true,
          dispatchId: `DISP-${Date.now()}`,
          incidentId,
          responderId,
          dispatchedAt: new Date().toISOString(),
        });
      } catch (err) {
        return sendJson(res, 400, { error: 'Invalid JSON payload' });
      }
    });
    return;
  }

  // 404 Fallback
  sendJson(res, 404, { error: 'Endpoint not found', path: pathname });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`DisasterShield Emergency Backend Server Running!`);
  console.log(`Listening on: http://localhost:${PORT}`);
  console.log(`Health endpoint: http://localhost:${PORT}/api/health`);
  console.log(`Incidents endpoint: http://localhost:${PORT}/api/incidents`);
  console.log(`Disaster News endpoint: http://localhost:${PORT}/api/news`);
  console.log(`=======================================================`);
});
