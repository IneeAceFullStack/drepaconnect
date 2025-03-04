# DrépaConnect

La première plateforme santé dédiée aux patients drépanocytaires, médecins et donneurs de sang au Congo.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, proxied at `/api`)
- `pnpm --filter @workspace/drepaconnect run dev` — run the frontend (port 23586, proxied at `/`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET` — JWT signing secret

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Wouter (routing), TanStack Query, Tailwind CSS, Framer Motion, Recharts
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Auth: JWT (bcryptjs + jsonwebtoken), token stored in `localStorage` as `drepa_token`
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for all API contracts)
- `lib/db/src/schema/` — Drizzle ORM schemas (source of truth for DB)
- `lib/api-client-react/src/generated/` — Generated React Query hooks (do not edit manually)
- `lib/api-zod/src/generated/` — Generated Zod schemas (do not edit manually)
- `artifacts/api-server/src/routes/` — Express route handlers (one file per module)
- `artifacts/drepaconnect/src/pages/` — React page components
- `artifacts/drepaconnect/src/contexts/AuthContext.tsx` — Auth state and JWT helpers

## Architecture decisions

- Contract-first API: OpenAPI spec drives both frontend hooks (Orval) and server-side validation (Zod)
- JWT auth via localStorage (`drepa_token`); custom Orval fetch (`lib/api-client-react/src/custom-fetch.ts`) injects Bearer token automatically
- All 10 modules share a single Express app; routes are registered in `artifacts/api-server/src/routes/index.ts`
- DB enums (role, sickle_type, blood_type, etc.) defined in `lib/db/src/schema/enums.ts` and shared across all schema files
- Genetic risk calculator is stateless (no DB writes required); all other modules require authentication

## Product — 10 modules

1. **Calculateur génétique** — Calculates child risk probability from both parents' genotypes (AA/AS/SS/AC/SC)
2. **Carte des centres** — Map of sickle cell screening & care centers across Congo provinces
3. **Journal de crises** — Patient crisis journal with intensity tracking, triggers, and charts
4. **Modules éducatifs** — Multilingual health education cards (patients, parents, teachers, doctors)
5. **Tableau de bord médecin** — Doctor view for managing patients and reviewing their data
6. **Suivi de grossesse** — Pregnancy tracking module with risk assessment
7. **Carnet de santé numérique** — Digital health record timeline (labs, consultations, transfusions)
8. **Réseau de donneurs** — Blood donor network and urgent request broadcast
9. **Gestion des médicaments** — Medication schedule tracker with reminders
10. **Statistiques nationales** — National sickle cell statistics charts

## Demo accounts (password: `password123`)

| Role    | Email                       |
|---------|-----------------------------|
| Doctor  | doctor@drepaconnect.cd      |
| Patient | patient@drepaconnect.cd     |
| Donor   | donor@drepaconnect.cd       |

## User preferences

- French-language UI throughout (target audience: DRC/Congo)
- Brand: plum/purple (`#3D1A5F`) + rose/pink accents, DM Serif Display headings, DM Sans body

## Gotchas

- After editing OpenAPI spec, always run `pnpm --filter @workspace/api-spec run codegen` before touching frontend hooks
- `lib/api-client-react/src/index.ts` must not export `setBaseUrl`/`setAuthTokenGetter` — those were removed when custom-fetch was updated for JWT auth
- DB `push` only works in dev; never run against production without a migration plan

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
