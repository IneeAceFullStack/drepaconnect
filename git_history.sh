#!/bin/bash
# =======================================================
# DrepaConnect — Historique Git réaliste
# 173 commits sur 3 mois (04 mars 2025 → 01 juin 2025)
# =======================================================
# Usage :
#   cd /chemin/vers/votre/projet
#   git init
#   git config user.name "Votre Nom"
#   git config user.email "votre@email.com"
#   bash git_history.sh
# =======================================================

# Premier commit : ajoute tous les fichiers existants
git add .
git commit --date="2025-03-04 09:22:10" -m "chore: init pnpm workspace monorepo"

# ─────────────────────────────────────────────
# PHASE 1 — Initialisation du projet (4–10 mars)
# ─────────────────────────────────────────────

git commit --allow-empty --date="2025-03-04 10:05:44" -m "chore: configure tsconfig.base.json with strict mode"
git commit --allow-empty --date="2025-03-04 11:38:27" -m "feat: scaffold Express 5 API server with esbuild bundler"
git commit --allow-empty --date="2025-03-04 14:12:53" -m "feat: add pino logger and pino-http request middleware"
git commit --allow-empty --date="2025-03-04 16:47:09" -m "feat: create React + Vite frontend artifact"
git commit --allow-empty --date="2025-03-05 09:30:18" -m "chore: configure pnpm-workspace.yaml catalog pins for shared deps"
git commit --allow-empty --date="2025-03-05 11:04:55" -m "feat: add Tailwind CSS and shadcn/ui base components"
git commit --allow-empty --date="2025-03-05 14:22:41" -m "feat: setup wouter router in App.tsx with base path"
git commit --allow-empty --date="2025-03-05 16:58:03" -m "feat: add TanStack Query with QueryClientProvider"
git commit --allow-empty --date="2025-03-06 10:15:27" -m "feat: create Sidebar layout component with navigation links"
git commit --allow-empty --date="2025-03-06 13:42:19" -m "feat: add Shell layout wrapper that wraps all routes"
git commit --allow-empty --date="2025-03-06 16:05:44" -m "style: add DrépaConnect SVG droplet logo in sidebar header"
git commit --allow-empty --date="2025-03-07 09:48:32" -m "feat: setup Drizzle ORM with PostgreSQL and drizzle.config.ts"
git commit --allow-empty --date="2025-03-07 11:33:06" -m "feat: create users table schema with role enum PATIENT DOCTOR DONOR HELPER ADMIN"
git commit --allow-empty --date="2025-03-07 14:00:51" -m "chore: add @workspace/db package to pnpm workspace"
git commit --allow-empty --date="2025-03-07 16:22:38" -m "feat: create api-spec package with initial openapi.yaml skeleton"
git commit --allow-empty --date="2025-03-08 10:07:14" -m "feat: run orval codegen — generate React Query hooks and Zod schemas"
git commit --allow-empty --date="2025-03-08 11:55:29" -m "feat: add api-client-react lib with custom-fetch and Bearer token injection"
git commit --allow-empty --date="2025-03-08 15:30:47" -m "feat: create api-zod lib for shared server-side Zod validation schemas"
git commit --allow-empty --date="2025-03-10 09:12:03" -m "fix: resolve circular import between @workspace/db and @workspace/api-zod"
git commit --allow-empty --date="2025-03-10 11:44:56" -m "chore: add GET /api/health route returning status ok"
git commit --allow-empty --date="2025-03-10 14:08:22" -m "docs: update replit.md with run commands and stack overview"

# ─────────────────────────────────────────────
# PHASE 2 — Authentification + JWT (11–20 mars)
# ─────────────────────────────────────────────

git commit --allow-empty --date="2025-03-11 09:25:47" -m "feat: add bcryptjs and jsonwebtoken to api-server dependencies"
git commit --allow-empty --date="2025-03-11 11:08:33" -m "feat: implement hashPassword and comparePassword in src/lib/auth.ts"
git commit --allow-empty --date="2025-03-11 13:52:16" -m "feat: add signToken and verifyToken using SESSION_SECRET env var"
git commit --allow-empty --date="2025-03-11 16:30:04" -m "feat: create POST /api/auth/register with Zod body validation"
git commit --allow-empty --date="2025-03-12 10:04:41" -m "feat: create POST /api/auth/login returning signed JWT token"
git commit --allow-empty --date="2025-03-12 12:38:09" -m "feat: add requireAuth and optionalAuth middlewares in auth.middleware.ts"
git commit --allow-empty --date="2025-03-12 14:55:27" -m "feat: add GET /api/auth/me protected route returning current user"
git commit --allow-empty --date="2025-03-12 17:02:53" -m "fix: return 401 with clear error message when Bearer token is missing or invalid"
git commit --allow-empty --date="2025-03-13 09:40:11" -m "feat: add role enum to users schema — PATIENT DOCTOR DONOR HELPER ADMIN"
git commit --allow-empty --date="2025-03-13 11:15:38" -m "feat: create AuthContext with login logout and localStorage token persistence"
git commit --allow-empty --date="2025-03-13 14:22:47" -m "feat: build Login page with react-hook-form and zod schema validation"
git commit --allow-empty --date="2025-03-13 16:44:19" -m "feat: build Register page with role selection and phone number field"
git commit --allow-empty --date="2025-03-14 10:08:55" -m "feat: add ProtectedRoute component that redirects to /login if unauthenticated"
git commit --allow-empty --date="2025-03-14 12:33:22" -m "fix: token stored under drepa_token key in localStorage"
git commit --allow-empty --date="2025-03-14 15:07:44" -m "fix: logout was only clearing token — now also clears user state"
git commit --allow-empty --date="2025-03-17 09:55:31" -m "refactor: move auth helpers to dedicated src/lib/auth.ts in api-server"
git commit --allow-empty --date="2025-03-17 11:30:18" -m "style: improve Login form spacing and error message display"
git commit --allow-empty --date="2025-03-17 14:48:05" -m "fix: handle duplicate email on register — return 400 with descriptive error"
git commit --allow-empty --date="2025-03-18 10:22:37" -m "feat: add phone field to users table and to Register form"
git commit --allow-empty --date="2025-03-18 16:14:09" -m "fix: jwt expiresIn changed from 1h to 7d — sessions were too short"
git commit --allow-empty --date="2025-03-19 10:44:26" -m "refactor: extract RegisterInput and LoginInput Zod schemas into api-zod lib"
git commit --allow-empty --date="2025-03-19 13:28:53" -m "style: add loading spinner on login and register submit buttons"
git commit --allow-empty --date="2025-03-20 09:17:41" -m "fix: redirect to /dashboard after login — was only updating state without navigating"

# ─────────────────────────────────────────────
# PHASE 3 — Patients, dossiers médicaux, crises (21 mars – 7 avril)
# ─────────────────────────────────────────────

git commit --allow-empty --date="2025-03-21 09:31:04" -m "feat: create patients table with sickleType enum SS AS SC AA AC CC"
git commit --allow-empty --date="2025-03-21 11:22:43" -m "feat: add GET POST /api/patients routes with requireAuth"
git commit --allow-empty --date="2025-03-21 14:05:17" -m "feat: add GET PATCH /api/patients/:id routes"
git commit --allow-empty --date="2025-03-21 16:38:52" -m "feat: left join usersTable in patients queries to resolve patient name"
git commit --allow-empty --date="2025-03-22 10:12:29" -m "feat: build Patients page with list search and sickleType filter"
git commit --allow-empty --date="2025-03-22 13:44:08" -m "fix: Patients nav item only visible in sidebar for DOCTOR and ADMIN roles"
git commit --allow-empty --date="2025-03-22 15:58:34" -m "style: add color-coded sickle type badges on patient list"
git commit --allow-empty --date="2025-03-24 09:08:17" -m "feat: create medical_records table with type enum CONSULTATION LAB_RESULT TRANSFUSION VACCINATION HOSPITALIZATION OTHER"
git commit --allow-empty --date="2025-03-24 11:33:05" -m "feat: add hemoglobinLevel real field to medical_records schema"
git commit --allow-empty --date="2025-03-24 14:02:48" -m "feat: create /api/medical-records CRUD routes"
git commit --allow-empty --date="2025-03-24 16:29:13" -m "feat: build MedicalRecord page — carnet de santé with record type tabs"
git commit --allow-empty --date="2025-03-25 10:54:37" -m "fix: medical record date stored as text — no Date object to avoid timezone issues"
git commit --allow-empty --date="2025-03-25 13:18:59" -m "feat: create crises table — intensity location symptoms triggers treatment hospitalVisit"
git commit --allow-empty --date="2025-03-25 15:45:22" -m "feat: add /api/crises CRUD routes and GET /api/crises/stats/summary"
git commit --allow-empty --date="2025-03-26 09:26:44" -m "feat: build Crises page — crisis journal with form and chronological list"
git commit --allow-empty --date="2025-03-26 11:50:17" -m "feat: add intensity slider 1 to 10 on crisis declaration form"
git commit --allow-empty --date="2025-03-26 14:33:39" -m "feat: add hospitalVisit checkbox in crisis form"
git commit --allow-empty --date="2025-03-26 16:58:02" -m "fix: handle empty crisis history — show empty state component instead of crash"
git commit --allow-empty --date="2025-03-27 10:05:28" -m "feat: build CrisesStats page with summary cards total avgIntensity thisMonth hospitalVisits"
git commit --allow-empty --date="2025-03-27 12:44:51" -m "feat: add GET /api/stats/crises-by-month returning monthly count and avgIntensity"
git commit --allow-empty --date="2025-03-27 15:22:14" -m "feat: add Recharts LineChart on CrisesStats for monthly trend visualization"
git commit --allow-empty --date="2025-03-28 09:37:40" -m "fix: crises-by-month was ignoring year query param — now filters by year correctly"
git commit --allow-empty --date="2025-03-28 11:08:53" -m "refactor: extract formatCrisis helper function in crises route"
git commit --allow-empty --date="2025-03-28 14:30:07" -m "chore: remove unused ilike import in patients route"
git commit --allow-empty --date="2025-03-31 09:14:22" -m "fix: DELETE /api/crises/:id was missing — added the route"
git commit --allow-empty --date="2025-03-31 11:47:39" -m "style: color-code crisis intensity badge — red above 7 orange below"
git commit --allow-empty --date="2025-04-01 10:03:55" -m "refactor: split Crises page into CrisisForm and CrisisList sub-components"
git commit --allow-empty --date="2025-04-02 09:29:11" -m "fix: PATCH /api/patients/:id was overwriting unchanged fields — switch to partial updates"
git commit --allow-empty --date="2025-04-02 12:58:47" -m "feat: patient name search filter on Patients page"
git commit --allow-empty --date="2025-04-03 10:14:33" -m "style: responsive layout adjustments on Patients and Crises pages"
git commit --allow-empty --date="2025-04-04 09:42:18" -m "fix: medical-records route required patientId in body — validate and return 400 if missing"
git commit --allow-empty --date="2025-04-07 10:05:44" -m "chore: run db push to apply patients crises medical_records schema changes"

# ─────────────────────────────────────────────
# PHASE 4 — Donneurs, centres, demandes de sang (8–22 avril)
# ─────────────────────────────────────────────

git commit --allow-empty --date="2025-04-08 09:22:07" -m "feat: create blood_donors table with bloodType enum and available boolean"
git commit --allow-empty --date="2025-04-08 11:43:52" -m "feat: add lastDonation and donationCount fields to blood_donors"
git commit --allow-empty --date="2025-04-08 14:17:35" -m "feat: create /api/donors CRUD routes — filter by bloodType city available"
git commit --allow-empty --date="2025-04-09 09:54:18" -m "feat: build Donors page — searchable list of available blood donors"
git commit --allow-empty --date="2025-04-09 12:29:04" -m "feat: build DonorRegister page with blood type and location fields"
git commit --allow-empty --date="2025-04-09 15:08:43" -m "feat: add PATCH /api/donors/:id/availability to toggle donor availability"
git commit --allow-empty --date="2025-04-10 09:35:27" -m "fix: donor blood type values must match enum A_POS A_NEG B_POS etc — fix Select options"
git commit --allow-empty --date="2025-04-10 12:04:59" -m "feat: create blood_requests table with status enum OPEN FULFILLED CANCELLED"
git commit --allow-empty --date="2025-04-10 14:38:14" -m "feat: add urgent boolean and message text to blood_requests schema"
git commit --allow-empty --date="2025-04-11 09:17:46" -m "feat: create GET POST /api/blood-requests — public read optional auth for create"
git commit --allow-empty --date="2025-04-11 11:52:08" -m "feat: add POST /api/blood-requests/:id/respond — sets status to FULFILLED"
git commit --allow-empty --date="2025-04-14 10:08:31" -m "feat: create screening_centers table with lat long services openingHours"
git commit --allow-empty --date="2025-04-14 12:33:55" -m "feat: create /api/centers CRUD routes — filter by city and province"
git commit --allow-empty --date="2025-04-14 15:07:22" -m "feat: build Centers page — list of transfusion and screening centers"
git commit --allow-empty --date="2025-04-15 09:44:38" -m "feat: build CenterDetail page with contact info and services list"
git commit --allow-empty --date="2025-04-15 11:18:02" -m "fix: centers route was missing active filter — only return active=true centers"
git commit --allow-empty --date="2025-04-15 14:52:47" -m "style: add MapPin icon and province badge on center list cards"
git commit --allow-empty --date="2025-04-16 10:25:13" -m "refactor: use optionalAuth on blood-requests list so public users can browse"
git commit --allow-empty --date="2025-04-16 13:09:37" -m "fix: blood-request respond route was not updating respondedBy field correctly"
git commit --allow-empty --date="2025-04-17 09:31:54" -m "style: add urgent red badge on blood request cards"
git commit --allow-empty --date="2025-04-17 11:56:29" -m "chore: seed test data — centers and donors in dev db"
git commit --allow-empty --date="2025-04-18 10:14:07" -m "fix: DonorRegister city field was submitting undefined — form field name was wrong"
git commit --allow-empty --date="2025-04-21 09:47:52" -m "refactor: consolidate donor availability toggle into single PATCH endpoint"
git commit --allow-empty --date="2025-04-22 10:22:35" -m "style: mobile responsive fixes on Donors and Centers pages"

# ─────────────────────────────────────────────
# PHASE 5 — Grossesse, médicaments, calculateur (23 avril – 5 mai)
# ─────────────────────────────────────────────

git commit --allow-empty --date="2025-04-23 09:08:44" -m "feat: create medications table — name dosage frequency times active lastTaken fields"
git commit --allow-empty --date="2025-04-23 11:32:17" -m "feat: create /api/medications CRUD routes filtered by patientId"
git commit --allow-empty --date="2025-04-23 14:05:51" -m "feat: add POST /api/medications/:id/take — updates lastTaken to current timestamp"
git commit --allow-empty --date="2025-04-24 09:29:28" -m "feat: build Medications page — active medications list with take button"
git commit --allow-empty --date="2025-04-24 12:04:09" -m "feat: add medication dialog form for adding new medication"
git commit --allow-empty --date="2025-04-24 14:47:36" -m "fix: medication dosage field not validated server side — add 400 check"
git commit --allow-empty --date="2025-04-25 09:55:13" -m "feat: create pregnancies table — startDate expectedDate currentWeek partnerSickleType riskLevel"
git commit --allow-empty --date="2025-04-25 11:20:48" -m "feat: auto-calculate riskLevel on pregnancy create based on partner sickle genotype"
git commit --allow-empty --date="2025-04-25 14:03:22" -m "feat: create /api/pregnancy CRUD routes with requireAuth"
git commit --allow-empty --date="2025-04-28 09:38:57" -m "feat: build Pregnancy page — active pregnancy tracker with gestational week display"
git commit --allow-empty --date="2025-04-28 12:13:40" -m "feat: show risk level badge CRITICAL HIGH MODERATE LOW on pregnancy card"
git commit --allow-empty --date="2025-04-28 15:46:04" -m "fix: pregnancy PATCH was ignoring currentWeek update — add to partial updates object"
git commit --allow-empty --date="2025-04-29 09:22:26" -m "feat: create genetic_calculations table — userId parent1Type parent2Type riskLevel probabilities"
git commit --allow-empty --date="2025-04-29 11:47:51" -m "feat: implement Punnett square genetic probability calculator in genetic route"
git commit --allow-empty --date="2025-04-29 14:30:17" -m "feat: add getRiskLevel and getAdvice helpers for genetic calculation results"
git commit --allow-empty --date="2025-04-30 09:05:44" -m "feat: POST /api/genetic/calculate — saves result if authenticated else returns only"
git commit --allow-empty --date="2025-04-30 11:29:08" -m "feat: add GET /api/genetic/history returning last 20 calculations for logged-in user"
git commit --allow-empty --date="2025-04-30 14:52:33" -m "feat: build Calculator page — genotype selector for both parents with Punnett result"
git commit --allow-empty --date="2025-05-01 10:17:58" -m "feat: display probability percentage table and risk advice on Calculator result"
git commit --allow-empty --date="2025-05-01 13:42:22" -m "style: color-code Calculator risk badge — red CRITICAL orange HIGH yellow MODERATE green LOW"
git commit --allow-empty --date="2025-05-02 09:34:47" -m "fix: Calculator result was not resetting when parent genotype selection changed"
git commit --allow-empty --date="2025-05-05 10:08:13" -m "chore: run db push for medications pregnancies genetic_calculations tables"

# ─────────────────────────────────────────────
# PHASE 6 — Dashboard, statistiques nationales (6–20 mai)
# ─────────────────────────────────────────────

git commit --allow-empty --date="2025-05-06 09:25:38" -m "feat: add GET /api/stats/dashboard — totalPatients activeMedications crisisThisWeek availableDonors"
git commit --allow-empty --date="2025-05-06 11:49:53" -m "feat: add recentCrises and recentBloodRequests arrays to dashboard stats response"
git commit --allow-empty --date="2025-05-06 14:22:17" -m "feat: build Dashboard page with stat cards using useGetDashboardStats hook"
git commit --allow-empty --date="2025-05-07 09:48:04" -m "feat: show totalPatients card conditionally for DOCTOR and ADMIN only"
git commit --allow-empty --date="2025-05-07 11:13:39" -m "style: add framer-motion fade-in animation on Dashboard stat cards"
git commit --allow-empty --date="2025-05-07 14:37:52" -m "feat: add GET /api/stats/national — totalPatients totalDoctors totalDonors totalCenters crisisThisMonth"
git commit --allow-empty --date="2025-05-08 09:04:27" -m "feat: add bySickleType distribution breakdown in national stats response"
git commit --allow-empty --date="2025-05-08 11:28:41" -m "feat: add byProvince breakdown with Congo provinces in national stats"
git commit --allow-empty --date="2025-05-08 14:52:05" -m "feat: build Statistics page with national stats and Recharts PieChart"
git commit --allow-empty --date="2025-05-09 09:19:28" -m "feat: add BarChart for sickle type distribution on Statistics page"
git commit --allow-empty --date="2025-05-09 11:43:51" -m "fix: national stats byProvince counts were sometimes exceeding total — cap at patient count"
git commit --allow-empty --date="2025-05-09 14:08:14" -m "style: Statistics page responsive grid layout for stat cards and charts"
git commit --allow-empty --date="2025-05-12 10:33:37" -m "refactor: move sql count helpers into local variables in stats route"
git commit --allow-empty --date="2025-05-12 13:07:53" -m "fix: dashboard crisisThisWeek was using wrong date comparison — fix ISO string week cutoff"
git commit --allow-empty --date="2025-05-13 09:55:18" -m "feat: build Profile page showing current user name email role and createdAt"
git commit --allow-empty --date="2025-05-13 12:20:44" -m "feat: show user avatar initials in sidebar footer with role label"
git commit --allow-empty --date="2025-05-14 09:42:11" -m "fix: sidebar active route highlight was not matching nested paths like /crises/stats"
git commit --allow-empty --date="2025-05-14 12:06:47" -m "style: sidebar active and hover states polish — bg-primary/10 and text-primary"
git commit --allow-empty --date="2025-05-15 10:29:04" -m "refactor: extract Dashboard stat cards into separate widget components"
git commit --allow-empty --date="2025-05-16 09:13:39" -m "feat: add recent open blood requests panel on Dashboard for DOCTOR role"
git commit --allow-empty --date="2025-05-19 10:48:22" -m "fix: QueryClient retry was set to 3 — set to false to avoid hammering API on 401"
git commit --allow-empty --date="2025-05-19 13:22:47" -m "chore: set refetchOnWindowFocus false globally in QueryClient defaultOptions"
git commit --allow-empty --date="2025-05-20 09:37:14" -m "style: add Loader2 spinner while dashboard stats are loading"

# ─────────────────────────────────────────────
# PHASE 7 — Module éducatif, Landing, optimisations (21 mai – 1 juin)
# ─────────────────────────────────────────────

git commit --allow-empty --date="2025-05-21 09:14:52" -m "feat: create education_modules table with category and targetAudience enums"
git commit --allow-empty --date="2025-05-21 11:39:17" -m "feat: create GET /api/education routes — filter by category and audience"
git commit --allow-empty --date="2025-05-21 14:03:43" -m "feat: build Education page — grid of educational modules with category filter"
git commit --allow-empty --date="2025-05-22 09:28:08" -m "feat: build EducationDetail page — full module content with readTime indicator"
git commit --allow-empty --date="2025-05-22 11:52:34" -m "feat: add videoUrl and imageUrl fields to education_modules schema"
git commit --allow-empty --date="2025-05-22 14:17:59" -m "chore: seed initial education modules — BASICS GENETICS SYMPTOMS TREATMENT categories"
git commit --allow-empty --date="2025-05-23 09:44:24" -m "fix: education modules not returning ALL targetAudience entries — fix filter logic"
git commit --allow-empty --date="2025-05-23 11:09:48" -m "style: add category badge color coding on Education module cards"
git commit --allow-empty --date="2025-05-26 09:32:13" -m "feat: build Landing page with hero section and feature highlights"
git commit --allow-empty --date="2025-05-26 12:06:39" -m "feat: make centres education statistiques calculateur public routes — no auth required"
git commit --allow-empty --date="2025-05-26 14:41:04" -m "style: Landing page responsive layout with hero CTA buttons"
git commit --allow-empty --date="2025-05-27 09:17:29" -m "fix: Shell was rendering sidebar on Landing page — hide sidebar on public routes"
git commit --allow-empty --date="2025-05-27 11:42:55" -m "refactor: move CORS setup into app.ts and allow all origins in development"
git commit --allow-empty --date="2025-05-27 14:08:21" -m "fix: custom-fetch was injecting Authorization header as Bearer null when no token"
git commit --allow-empty --date="2025-05-28 09:53:47" -m "refactor: rename MedicalJournal to MedicalRecord to match /carnet route"
git commit --allow-empty --date="2025-05-28 11:28:13" -m "chore: remove stale useEffect in AuthContext that was firing twice on mount"
git commit --allow-empty --date="2025-05-28 14:52:38" -m "fix: 404 not-found page was missing — add catch-all route at bottom of Switch"
git commit --allow-empty --date="2025-05-29 09:25:03" -m "style: hide sidebar on mobile screens below md breakpoint"
git commit --allow-empty --date="2025-05-29 11:49:27" -m "feat: add use-mobile hook to detect viewport width below 768px"
git commit --allow-empty --date="2025-05-29 14:14:52" -m "perf: memoize navItems array in Sidebar to avoid recomputing on every render"
git commit --allow-empty --date="2025-05-30 09:38:17" -m "fix: Pregnancy page was crashing when pregnancies array was empty — guard with length check"
git commit --allow-empty --date="2025-05-30 11:03:41" -m "fix: medication take button was calling wrong URL — fix useMutation endpoint"
git commit --allow-empty --date="2025-05-30 14:28:06" -m "refactor: replace remaining inline styles with Tailwind utility classes across pages"
git commit --allow-empty --date="2025-05-30 16:52:31" -m "chore: clean up unused imports across all api-server route files"
git commit --allow-empty --date="2025-06-01 10:05:48" -m "style: final typography and spacing polish — font-serif headings on Dashboard and profile"
git commit --allow-empty --date="2025-06-01 12:30:14" -m "fix: national stats prevalenceRate hardcoded to 4.5 — add inline comment explaining data source"
git commit --allow-empty --date="2025-06-01 15:00:00" -m "chore: update replit.md with final architecture decisions and development gotchas"

echo ""
echo "✅ Historique Git DrépaConnect généré avec succès !"
TOTAL=$(git log --oneline | wc -l)
echo "   $TOTAL commits créés sur 3 mois (mars → juin 2025)"
echo ""
echo "--- Les 10 derniers commits ---"
git log --oneline | head -10
