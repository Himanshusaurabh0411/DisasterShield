# DisasterShield Emergency Backend API

This is the lightweight, zero-dependency REST backend for **DisasterShield**. It works immediately with standard Node.js without requiring external dependencies or database setups, and is easily customizable with MongoDB, PostgreSQL, or SQLite.

## How to Run the Backend

From the project root:
```bash
node server/server.js
```
Or:
```bash
npm run server
```

The server will start on: **`http://localhost:5001`**

---

## API Endpoints

### 1. Health & Status
- **`GET /api/health`**
  - Returns backend online status, uptime, and database records count.

### 2. Incident Management
- **`GET /api/incidents`**
  - Query parameters: `?priority=critical`, `?type=flood`, `?status=dispatched`
  - Returns list of emergency incidents.
- **`GET /api/incidents/:id`**
  - Returns specific incident details.
- **`POST /api/incidents`**
  - Create new incident report.
- **`PATCH /api/incidents/:id/status`**
  - Body: `{"status": "verified" | "dispatched" | "resolved"}`
  - Updates incident verification and dispatch status.

### 3. Disaster News Portal
- **`GET /api/news`**
  - Query parameters: `?category=cyclone`, `?type=flood`
  - Returns list of verified disaster news articles, recovery dossiers, and field updates.
- **`GET /api/news/:id`**
  - Returns full disaster situation report dossier.
- **`POST /api/news`**
  - Submit new field news bulletin.

### 4. Responder Dispatch
- **`GET /api/responders`**
  - Returns available search & rescue squads, medical units, and boat flotillas.
- **`POST /api/dispatch`**
  - Body: `{"incidentId": "inc-1", "responderId": "resp-1"}`
  - Dispatches nearest responder unit.

---

## Connecting Frontend to Backend
The frontend is pre-configured to communicate with `http://localhost:5000/api` via `VITE_API_BASE_URL` in `.env`.
If the backend is not running, the frontend automatically falls back to local data storage without breaking.
