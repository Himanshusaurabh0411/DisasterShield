# DisasterShield (आपदा शील्ड)
## Cloud Based Disaster Management & Citizen Response System
### National Disaster Management Authority (NDMA) / NIC Portal Framework

DisasterShield is a mission-critical emergency operations platform designed for rapid citizen incident reporting, resilient offline data preservation during telecom infrastructure failure, and automated deployment of NDRF, SDRF, and Medical Rapid Response Units.

The interface is built in strict adherence to the visual identity and guidelines of official Indian Government portals (specifically modeled after `ndma.gov.in` and National Informatics Centre / GIGW accessibility frameworks).

---

## 🌟 Core Features

- **🏛️ Official Indian Government Portal Design (GIGW & NIC Compliant)**
  - Top Indian Tricolor accessibility bar with font scaling (`A-` / `A` / `A+`) and bilingual toggle.
  - Official thick header with the State Emblem of India (Ashoka Lion Capital), NDMA typography, and 24x7 emergency helplines (`1078` / `112`).
  - Solid institutional navy navigation bar (`#003366`) with subtle saffron highlights.
  - Classic NIC scrolling news ticker ("LATEST UPDATES | नवीनतम अपडेट") with play/pause controls.
  - GIGW 4-column NIC institutional footer with statutory compliance notices.

- **📡 Offline-First Resilience (Zero Data Loss)**
  - Full client-side offline caching using `localStorage` and `IndexedDB`.
  - When cellular networks fail during cyclones or earthquakes, emergency intimations are encrypted and preserved on-device with unique tracking dockets.
  - Automated background queue synchronization the moment internet connectivity returns.

- **📝 FORM NDMA-01: Citizen Emergency Intimation**
  - 5-stage formal government report workflow:
    1. Incident Classification & Casualty Estimates
    2. Exact Geotag Coordinates & Landmark HUD
    3. Photographic / Video Evidence Upload
    4. Informant Mobile Number & Verification
    5. Audit Summary & Formal Submission

- **🔍 Public Incident Status Tracker**
  - Citizen tracking by docket number (e.g. `DS-2026-XXXXX`).
  - 8-stage statutory verification audit timeline from device storage to field resolution.

- **🗺️ National GIS Situation Room**
  - Interactive geospatial disaster map projection with casualty density hotspots.
  - Multi-parameter filtering by disaster peril, urgency tier, and response status.

- **🚨 EOC Tactical Deployment Console**
  - Frontline dispatch desk for NDRF battalions, SDRF units, and medical squads.
  - Live state mutations: "Accept Intimation", "Commence Operation", and "Mark Resolved".
  - Automated unit matching engine evaluating proximity and squad capacity.

- **📊 National Statistical Bulletin & Analytics**
  - Telemetry and dispatch velocity curves visualized with accessible, high-contrast charts.
  - Printable official PDF reports.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Lucide Icons + Custom Government UI Primitives
- **Animations**: Framer Motion
- **Visualizations**: Recharts + Three.js / React Three Fiber
- **State Management**: React Context + Offline Storage Service

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/Himanshusaurabh0411/DisasterShield.git

# Navigate to project directory
cd DisasterShield

# Install dependencies
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### Production Build
```bash
npm run build
```

---

## 📜 Statutory Mandate
Engineered in accordance with the provisions of the **Disaster Management Act, 2005** (Act No. 53 of 2005) enacted by the Parliament of India.
