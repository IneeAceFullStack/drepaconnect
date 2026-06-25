<div align="center">

<img src="https://img.shields.io/badge/DrepaConnect-Healthcare%20Platform-DC2626?style=for-the-badge&logo=heart&logoColor=white" alt="DrepaConnect" />

# DrepaConnect

### Full-Stack Healthcare Web Platform · Sickle Cell Disease Management

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=flat-square&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

**A production-ready REST API + React SPA built to digitalize sickle cell disease patient management in Central Africa.**

[Project Overview](#-project-overview) · [Features](#-features) · [Architecture](#-architecture) · [Tech Stack](#-tech-stack) · [Installation](#-installation) · [Configuration](#-configuration) · [Database](#-database-schema) · [API](#-api-reference) · [Future Improvements](#-future-improvements) · [Author](#-author)

</div>

---

## 📋 Project Overview

**DrepaConnect** is a comprehensive healthcare web platform designed to address the critical gap in digital health tools for sickle cell disease (drépanocytose) management in Central Africa. Sickle cell disease affects an estimated **4.5% of the population** in the Republic of Congo — making it the most common genetic disorder in the region — yet specialized digital management tools remain largely unavailable.

The platform serves multiple user types within a single ecosystem:

| Role | Description |
|------|-------------|
| 🩺 **Patient** | Logs crises, manages medications, tracks pregnancy, accesses their health journal |
| 🏥 **Doctor** | Reviews patient records, monitors crisis patterns, coordinates care |
| 🩸 **Blood Donor** | Registers availability, responds to urgent blood requests |
| 🧬 **Public** | Uses the genetic risk calculator, finds screening centers, reads education content |
| ⚙️ **Admin** | Full platform oversight and national statistics |

### Key Metrics

- **14 database tables** — fully typed with Drizzle ORM + PostgreSQL
- **12 REST API route modules** — documented with OpenAPI and code-generated with Orval
- **14 frontend pages** — built in React 19 with TanStack Query for server state
- **5 user roles** — fine-grained role-based access control on every protected endpoint
- **Contract-first API design** — OpenAPI spec → auto-generated React Query hooks + Zod schemas

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with 7-day token lifespan
- `bcryptjs` password hashing with salted rounds
- Role-based access control (RBAC) on all protected endpoints
- `requireAuth` / `optionalAuth` middleware for granular route protection
- Token persistence via `localStorage` with automatic injection on every API call

### 🩺 Patient Management
- Complete patient profiles with sickle cell genotype (SS, SC, AS, AA, AC, CC)
- Doctor-only patient list with name search and genotype filtering
- Partial PATCH updates — only changed fields are written to the database
- Patient-to-user join for name resolution across all queries

### 🚨 Pain Crisis Journal
- Log crisis events: intensity (1–10), body location, symptoms, triggers, treatment applied
- Hospital visit flag per crisis
- Monthly trend charts (Recharts `LineChart`) showing count and average intensity
- Summary statistics endpoint: total, average intensity, this-month count, hospital visits
- Full CRUD — create, read, update, delete

### 💊 Medication Tracker
- Active medication schedules with dosage, frequency, and daily time slots
- One-click "Take medication" action with precise `lastTaken` timestamp
- Medication adherence tracking over time

### 🤰 Pregnancy Monitoring
- Active pregnancy tracking with gestational week display
- Automatic risk level computation (CRITICAL / HIGH / MODERATE / LOW) based on partner's sickle genotype using a Punnett square-derived algorithm
- Expected delivery date tracking with week counter

### 🧬 Genetic Risk Calculator
- Full Punnett square implementation for sickle cell inheritance probabilities
- Calculates probability distribution for all possible child genotypes
- Risk level classification with personalized medical advice
- Saves calculation history for authenticated users (last 20 results)
- Accessible publicly — no account required to use

### 🩸 Blood Donor Network
- Searchable donor registry — filter by blood type, city, availability
- Availability toggle endpoint (`PATCH /api/donors/:id/availability`)
- Urgent blood request board with OPEN / FULFILLED / CANCELLED status lifecycle
- Public read access — no account needed to browse requests

### 🏥 Healthcare Center Directory
- Directory of transfusion and newborn screening centers across Congo provinces
- Province and city filtering
- Services list, opening hours, GPS coordinates (lat/long), contact details

### 📊 Dashboard & National Statistics
- Personal health dashboard with live stat widgets (total crises, active medications, upcoming appointments, available donors)
- Role-conditional widget rendering — doctors see patient counts, patients see their own data
- National statistics: patient distribution by province, genotype breakdown, donor availability
- Interactive Recharts `PieChart` and `BarChart` visualizations

### 📚 Education Library
- Categorized modules: BASICS, GENETICS, SYMPTOMS, TREATMENT
- Audience targeting: patients, parents, healthcare workers
- Video URL and image URL support per module
- Seeded with initial content — functional on first run

---

## 🏗 Architecture

DrepaConnect follows a **monorepo architecture** managed with `pnpm workspaces`, separating concerns into independent packages with strict TypeScript project references.

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                        │
│                    React 19 + Vite SPA                       │
│   wouter · TanStack Query · Radix UI · Tailwind · Recharts  │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS / REST JSON
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     EXPRESS 5 API SERVER                     │
│          JWT Auth · Zod Validation · Pino Logging           │
│                                                              │
│  /api/auth  /api/patients  /api/crises  /api/medications    │
│  /api/donors  /api/blood-requests  /api/centers             │
│  /api/pregnancy  /api/genetic  /api/stats  /api/education   │
└──────────────────────────┬──────────────────────────────────┘
                           │ Drizzle ORM (type-safe SQL)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                       POSTGRESQL 16                          │
│              14 tables · ENUMs · Foreign Keys               │
└─────────────────────────────────────────────────────────────┘
```

### Monorepo Package Map

```
drepaconnect/
├── artifacts/
│   ├── api-server/           # Express 5 REST API (Node.js, CJS bundle via esbuild)
│   │   └── src/
│   │       ├── routes/       # 12 route modules
│   │       ├── middleware/   # requireAuth, optionalAuth
│   │       ├── lib/          # auth helpers, logger singleton
│   │       └── index.ts
│   └── web/                  # React 19 + Vite SPA
│       └── src/
│           ├── pages/        # 14 page components
│           ├── components/   # Shared UI (Sidebar, Shell, widgets)
│           ├── context/      # AuthContext
│           └── App.tsx
├── lib/
│   ├── db/                   # Drizzle schemas (14 tables) — source of truth
│   ├── api-spec/             # openapi.yaml + Orval config
│   ├── api-client-react/     # Generated hooks + custom-fetch (Bearer injection)
│   └── api-zod/              # Shared Zod schemas (server-side validation)
├── scripts/                  # Utility scripts
├── pnpm-workspace.yaml       # Workspace catalog + overrides
├── tsconfig.base.json        # Shared strict TS config
└── tsconfig.json             # Solution file (composite libs only)
```

### Data Flow — Contract-First API Design

```
openapi.yaml  ──[Orval codegen]──▶  React Query hooks   (api-client-react)
                                ──▶  Zod schemas         (api-zod)

Server routes  ──[Zod.parse()]──▶  validated request body
               ──[Drizzle]─────▶  type-safe SQL queries
               ──[Zod.parse()]──▶  validated response shape
```

---

## 🛠 Tech Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| [React](https://react.dev/) | 19 | UI component framework |
| [Vite](https://vitejs.dev/) | 6 | Build tool & HMR dev server |
| [Wouter](https://github.com/molefrog/wouter) | 3 | Lightweight SPA router (2 KB) |
| [TanStack Query](https://tanstack.com/query) | 5 | Server state, caching, background sync |
| [Tailwind CSS](https://tailwindcss.com/) | 4 | Utility-first CSS framework |
| [Radix UI](https://www.radix-ui.com/) | latest | Accessible headless component primitives |
| [shadcn/ui](https://ui.shadcn.com/) | latest | Pre-built component layer over Radix |
| [Framer Motion](https://www.framer.com/motion/) | 12 | Animation library |
| [Recharts](https://recharts.org/) | 2 | Composable chart library |
| [React Hook Form](https://react-hook-form.com/) | 7 | Performant form state management |
| [Zod](https://zod.dev/) | 4 | Schema validation (shared with server) |

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| [Node.js](https://nodejs.org/) | 24 | JavaScript runtime |
| [Express](https://expressjs.com/) | 5 | HTTP server & middleware stack |
| [Drizzle ORM](https://orm.drizzle.team/) | latest | Type-safe PostgreSQL ORM |
| [PostgreSQL](https://www.postgresql.org/) | 16 | Primary relational database |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) | 9 | JWT signing and verification |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | 3 | Password hashing |
| [Pino](https://getpino.io/) | 9 | Structured JSON logging |
| [Zod](https://zod.dev/) | 4 | Input/output schema validation |

### Tooling & Infrastructure

| Technology | Purpose |
|-----------|---------|
| [pnpm workspaces](https://pnpm.io/workspaces) | Monorepo package management |
| [TypeScript](https://www.typescriptlang.org/) 5.9 | End-to-end static typing |
| [Orval](https://orval.dev/) | OpenAPI → React Query hooks + Zod schemas codegen |
| [esbuild](https://esbuild.github.io/) | Sub-second API server bundler |
| [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview) | Schema migrations & `db push` |

---

## 🚀 Installation

### Prerequisites

- **Node.js** 20 or later — [nodejs.org](https://nodejs.org/)
- **pnpm** 9 or later — `npm install -g pnpm`
- **PostgreSQL** 15 or later — [postgresql.org](https://www.postgresql.org/download/)

### Step 1 — Clone the repository

```bash
git clone https://github.com/IneeAceFullStack/drepaconnect.git
cd drepaconnect
```

### Step 2 — Install all workspace dependencies

```bash
pnpm install
```

### Step 3 — Configure environment variables

```bash
cp artifacts/api-server/.env.example artifacts/api-server/.env
```

Edit the file with your values (see [Configuration](#-configuration) below).

### Step 4 — Create the database

```bash
createdb drepaconnect
```

### Step 5 — Push the schema

```bash
pnpm --filter @workspace/db run push
```

### Step 6 — Start the development servers

```bash
# Terminal 1 — API server (port 5000)
pnpm --filter @workspace/api-server run dev

# Terminal 2 — React frontend (port 5173)
pnpm --filter @workspace/web run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ⚙️ Configuration

### Required Environment Variables

Create `artifacts/api-server/.env`:

```env
# ─── Database ───────────────────────────────────────────────
DATABASE_URL=postgresql://postgres:password@localhost:5432/drepaconnect

# ─── Authentication ─────────────────────────────────────────
SESSION_SECRET=replace-with-a-random-32-character-minimum-secret

# ─── Server ─────────────────────────────────────────────────
PORT=5000
NODE_ENV=development
```

### Environment Variable Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `SESSION_SECRET` | ✅ | JWT signing secret — minimum 32 characters |
| `PORT` | Optional | API server port (default: `5000`) |
| `NODE_ENV` | Optional | `development` or `production` |

### Regenerate the API client (after OpenAPI spec changes)

```bash
pnpm --filter @workspace/api-spec run codegen
```

### Run a full typecheck

```bash
pnpm run typecheck
```

---

## 🗄 Database Schema

Managed with **Drizzle ORM** — all schemas are defined in `lib/db/src/schema/` and serve as the single source of truth.

### Tables Overview

| Table | Key Fields | Notes |
|-------|-----------|-------|
| `users` | `id`, `name`, `email`, `passwordHash`, `role`, `phone`, `createdAt` | Role enum: PATIENT · DOCTOR · DONOR · HELPER · ADMIN |
| `patients` | `id`, `userId`, `sickleType`, `dateOfBirth`, `city`, `province` | Genotype enum: SS · SC · AS · AA · AC · CC |
| `medical_records` | `id`, `patientId`, `type`, `date`, `notes`, `hemoglobinLevel` | Type enum: CONSULTATION · LAB_RESULT · TRANSFUSION · VACCINATION · HOSPITALIZATION · OTHER |
| `crises` | `id`, `patientId`, `date`, `intensity`, `location`, `symptoms`, `triggers`, `treatment`, `hospitalVisit` | Intensity 1–10 |
| `medications` | `id`, `patientId`, `name`, `dosage`, `frequency`, `times`, `active`, `lastTaken` | |
| `pregnancies` | `id`, `patientId`, `startDate`, `expectedDate`, `currentWeek`, `partnerSickleType`, `riskLevel` | Risk enum: CRITICAL · HIGH · MODERATE · LOW |
| `genetic_calculations` | `id`, `userId`, `parent1Type`, `parent2Type`, `riskLevel`, `probabilities`, `createdAt` | `probabilities` stored as JSON |
| `blood_donors` | `id`, `userId`, `bloodType`, `city`, `available`, `lastDonation`, `donationCount` | Blood type enum: A_POS · A_NEG · B_POS · B_NEG · AB_POS · AB_NEG · O_POS · O_NEG |
| `blood_requests` | `id`, `requestedBy`, `bloodType`, `urgent`, `message`, `status`, `respondedBy` | Status enum: OPEN · FULFILLED · CANCELLED |
| `screening_centers` | `id`, `name`, `city`, `province`, `lat`, `long`, `services`, `openingHours`, `phone`, `active` | |
| `education_modules` | `id`, `title`, `category`, `targetAudience`, `content`, `readTime`, `videoUrl`, `imageUrl` | Category enum: BASICS · GENETICS · SYMPTOMS · TREATMENT |

### Entity Relationship (simplified)

```
users ──────┬──── patients ────┬──── medical_records
            │                  ├──── crises
            │                  ├──── medications
            │                  └──── pregnancies
            │
            ├──── blood_donors ────── blood_requests (respondedBy)
            └──── genetic_calculations
```

---

## 📡 API Reference

Base URL: `http://localhost:5000/api`

Authentication: `Authorization: Bearer <jwt_token>`

### Authentication

| Method | Endpoint | Auth | Request Body | Response |
|--------|----------|------|-------------|---------|
| `POST` | `/auth/register` | — | `{ name, email, password, role, phone? }` | `{ user, token }` |
| `POST` | `/auth/login` | — | `{ email, password }` | `{ user, token }` |
| `GET` | `/auth/me` | ✅ | — | `{ user }` |

### Patients

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/patients` | ✅ DOCTOR/ADMIN | List patients with name search and genotype filter |
| `POST` | `/patients` | ✅ | Create patient profile |
| `GET` | `/patients/:id` | ✅ | Get patient profile |
| `PATCH` | `/patients/:id` | ✅ | Partial update |

### Medical Records

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/medical-records` | ✅ | List records (filter by `patientId`, `type`) |
| `POST` | `/medical-records` | ✅ | Create record |
| `PATCH` | `/medical-records/:id` | ✅ | Update record |
| `DELETE` | `/medical-records/:id` | ✅ | Delete record |

### Crises

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/crises` | ✅ | List crises for current patient |
| `POST` | `/crises` | ✅ | Log new crisis event |
| `PATCH` | `/crises/:id` | ✅ | Update crisis |
| `DELETE` | `/crises/:id` | ✅ | Delete crisis |
| `GET` | `/crises/stats/summary` | ✅ | Summary stats (total, avgIntensity, hospitalVisits) |

### Medications

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/medications` | ✅ | List active medications |
| `POST` | `/medications` | ✅ | Add medication |
| `PATCH` | `/medications/:id` | ✅ | Update medication |
| `DELETE` | `/medications/:id` | ✅ | Remove medication |
| `POST` | `/medications/:id/take` | ✅ | Record medication taken (updates `lastTaken`) |

### Blood & Donors

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/donors` | — | List donors (filter: `bloodType`, `city`, `available`) |
| `POST` | `/donors` | ✅ | Register as donor |
| `PATCH` | `/donors/:id` | ✅ | Update donor profile |
| `PATCH` | `/donors/:id/availability` | ✅ | Toggle availability |
| `GET` | `/blood-requests` | — | List requests (filter: `status`, `bloodType`) |
| `POST` | `/blood-requests` | optional | Create blood request |
| `PATCH` | `/blood-requests/:id` | ✅ | Update request |
| `POST` | `/blood-requests/:id/respond` | ✅ | Respond — sets status to FULFILLED |

### Statistics

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/stats/dashboard` | ✅ | Personal summary + recent crises + open requests |
| `GET` | `/stats/national` | — | National counts, by province, by genotype |
| `GET` | `/stats/crises-by-month` | ✅ | Monthly trend data (count + avgIntensity) |

### Genetic Calculator

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/genetic/calculate` | optional | Run Punnett calculation, save if authenticated |
| `GET` | `/genetic/history` | ✅ | Last 20 saved calculations |

### Education

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/education` | — | List modules (filter: `category`, `audience`) |
| `GET` | `/education/:id` | — | Get full module content |
| `POST` | `/education` | ✅ ADMIN | Create module |
| `PATCH` | `/education/:id` | ✅ ADMIN | Update module |

### Healthcare Centers

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/centers` | — | List centers (filter: `city`, `province`) |
| `GET` | `/centers/:id` | — | Get center details |
| `POST` | `/centers` | ✅ ADMIN | Add center |
| `PATCH` | `/centers/:id` | ✅ ADMIN | Update center |

> **Auth:** ✅ = JWT required · optional = works with or without token · — = public endpoint

---

## 🖼 Screenshots

> _Screenshots of the deployed application._

| Dashboard | Crisis Journal | Genetic Calculator |
|-----------|---------------|-------------------|
| Patient health summary with stat widgets and charts | Chronological crisis log with intensity visualization | Punnett square results with probability breakdown |

| Blood Donor Network | Education Library | National Statistics |
|--------------------|-------------------|-------------------|
| Searchable donor registry with availability status | Categorized health modules with audience targeting | Province and genotype distribution charts |

---

## 🔮 Future Improvements

### High Impact (Portfolio / Job Search)

| Improvement | Impact |
|------------|--------|
| **Real-time notifications** (WebSocket / Socket.io) for urgent blood requests | High — demonstrates real-time systems |
| **PWA support** (service worker, offline mode) for low-connectivity environments | High — directly addresses the African healthcare context |
| **Email notifications** (Nodemailer / Resend) for crisis alerts and blood requests | Medium-High |
| **File upload** (medical record attachments, lab result PDFs) | Medium-High |
| **Appointment scheduling** between patients and doctors | High — missing core healthcare feature |
| **Map integration** (Mapbox / Leaflet) for center location visualization | Medium |
| **Role management UI** for administrators | Medium |
| **Audit logging** — track who viewed or modified sensitive patient records | Medium — healthcare compliance |

### Technical Improvements

| Improvement | Impact |
|------------|--------|
| **End-to-end testing** (Playwright / Cypress) | High — demonstrates test maturity |
| **Unit testing** (Vitest) for Punnett calculator and auth helpers | High |
| **Docker Compose** setup for local development | High — DevOps signal |
| **CI/CD pipeline** (GitHub Actions) with lint + typecheck + test | High |
| **API rate limiting** (express-rate-limit) | Medium — security |
| **Pagination** on all list endpoints | Medium |
| **Internationalization** (i18n) — French/English toggle | Medium — relevant for Congo context |
| **Refresh token** rotation to replace single-token auth | Medium — security |

---

## 👤 Author

**Pascale Perspicasse Destinée OLOLO**
*Full-Stack Developer · TypeScript · React · Node.js · PostgreSQL*

- 🌐 GitHub: [IneeAceFullStack](https://github.com/IneeAceFullStack)
- 📧 [ololoppd@gmail.com](mailto:ololoppd@gmail.com)
- 💼 LinkedIn: [Pascale Perspicasse Destinée OLOLO](https://www.linkedin.com/in/pascale-perspicasse-destinée-ololo-07474b374)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with purpose for sickle cell patients in Central Africa 🇨🇬

**DrepaConnect** · [Report a Bug](https://github.com/IneeAceFullStack/drepaconnect/issues) · [Request a Feature](https://github.com/IneeAceFullStack/drepaconnect/issues)

---

*Keywords: React · TypeScript · Node.js · Express · PostgreSQL · Drizzle ORM · REST API · JWT · TanStack Query · Tailwind CSS · Monorepo · pnpm workspaces · OpenAPI · Healthcare · Full-Stack*

</div>
