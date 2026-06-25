# DrepaConnect — Case Study

**A full-stack healthcare platform for sickle cell disease management in Central Africa**

*By Pascale Perspicasse Destinée OLOLO · Full-Stack Developer*

---

## Project Overview

DrepaConnect is a web application I designed and built to support the medical management of sickle cell disease (drépanocytose) in the Republic of Congo. The platform connects patients, doctors, blood donors, and healthcare centers in a single digital system — covering everything from daily pain crisis tracking to genetic risk calculation for prospective parents.

The project runs on a React 19 SPA backed by an Express 5 REST API, with PostgreSQL as the primary database managed through Drizzle ORM. The entire codebase is structured as a pnpm monorepo with strict TypeScript across all packages.

---

## Why I Built This

I started working on DrepaConnect because I kept coming back to the same realization: sickle cell disease is the most common genetic disorder in Central Africa — affecting roughly 4.5% of the population in Congo — and yet the infrastructure to manage it digitally is almost nonexistent in the region.

When a patient with drépanocytose has a painful crisis in Brazzaville, their doctor likely has no digital record of the last five crises — how intense they were, what triggered them, whether the patient ended up hospitalized. Medication adherence is tracked on paper. Pregnancy risk assessments are done without tools. Blood donors are reached through informal networks.

I wanted to build something that could realistically be deployed in that environment: a web app that works in a browser, doesn't require an app store, handles multiple user types with different data needs, and provides doctors with the kind of structured data they need to make better decisions over time.

My initial objective was narrower — a crisis journal and medication tracker. As I worked through the data model, I realized that crisis tracking without patient context was only half useful, and patient context without donor network integration left a major gap in acute care. The scope grew, but deliberately.

---

## The Problem This Solves

The pain points this platform addresses are concrete:

**For patients:**
The disease is episodic and unpredictable. Patients have no reliable way to log their crisis history in a structured format that a doctor can read back. Pain intensity, location, possible triggers, whether they went to the hospital — this information disappears into memory or informal notes. Over months, patterns emerge that could inform treatment decisions, but only if the data was captured in the first place.

**For doctors:**
Without a shared record system, a physician treating a new patient has no access to their crisis history, current medications, or whether they've been monitored during a pregnancy. The lack of structured data makes it difficult to detect worsening trends or evaluate the effectiveness of a treatment protocol.

**For the blood supply system:**
Sickle cell patients who need transfusions depend on a compatible blood supply. Finding donors in the right blood type in an emergency is done through personal contacts and phone calls. There's no searchable registry, no urgency signal, no way to track whether a request was fulfilled.

**For families planning a pregnancy:**
Knowing both parents' genotypes is essential for understanding the probability their child will be affected. Most people don't have access to a tool that explains this clearly, calculates the probabilities, and gives context about the risk level.

---

## My Thinking Before Starting

Before writing any code, I spent time deciding what kind of application this should be. A few alternatives I considered:

**Mobile-first app vs. web app:** I initially thought about a React Native app because of smartphone penetration in the region. I chose a web app instead for two reasons: no app store dependency, and easier access on shared devices in clinical settings. A PWA can be added later.

**Monolithic vs. API-separated architecture:** I chose to build a separate REST API from the start, even though it added complexity. My reasoning was that a clean API boundary would make it easier to support a mobile client later without rewriting business logic, and would force me to design proper data contracts rather than coupling frontend and backend together.

**Which database:** I considered SQLite for simplicity but ruled it out because of concurrent access patterns in a multi-user clinical setting. PostgreSQL gave me proper enum types, foreign key constraints, and the query performance I'd need if the platform scaled. I also wanted experience with Drizzle ORM, which I chose over Prisma because it produces more predictable SQL and avoids the implicit query behaviors that can cause performance surprises in Prisma.

**Schema design first:** I spent significant time on the database schema before building routes. The sickle cell genotype system (SS, SC, AS, AA, AC, CC), the risk level computation for pregnancies, the blood type enum for donors — these decisions locked in early because changing them later would cascade across the entire application.

One constraint I set myself: every API endpoint had to be documented in an OpenAPI spec before implementation. I used Orval to generate typed React Query hooks and Zod schemas from that spec. This kept the client and server in sync and eliminated an entire category of runtime type mismatch bugs.

---

## Technical Choices

### Monorepo with pnpm workspaces

The codebase is organized as a monorepo with four library packages (`db`, `api-spec`, `api-client-react`, `api-zod`) and two application packages (the API server and the web frontend). This structure was deliberate.

The `db` package defines all Drizzle schemas and exports them to both the API server and the `api-zod` package. The `api-zod` package contains Zod schemas derived from those database types and is consumed by the API server for input validation. This means there's a single source of truth for data shapes that flows downward — database schema → Zod validation → OpenAPI spec → generated client hooks.

The alternative — keeping everything in a single package — would have been faster to start but would have made it much harder to maintain boundaries between concerns as the codebase grew.

### Contract-first API design

I defined the OpenAPI spec in `lib/api-spec/openapi.yaml` before implementing the routes. Orval then generated React Query hooks and Zod schemas automatically. This approach had one major benefit: I couldn't implement an endpoint without first thinking carefully about its inputs, outputs, and error cases. It also made the frontend significantly easier to build because the hooks came with full TypeScript types and built-in loading/error states.

### Express 5

I chose Express 5 over alternatives like Fastify or Hono primarily for familiarity and ecosystem maturity. Express 5 adds async error handling by default, which eliminates a common source of uncaught promise rejections in Express 4. For a project of this scope, the performance difference between frameworks was irrelevant.

### Drizzle ORM

Drizzle was the most interesting technical choice in this project. I chose it over Prisma specifically because it generates SQL that I can read and reason about directly. When I write a Drizzle query, I know exactly what SQL will be executed. That predictability matters when you're doing joins between `users` and `patients`, or computing aggregate statistics in the stats routes.

The tradeoff is that Drizzle is more verbose than Prisma for complex queries. Some of the crisis statistics queries — computing monthly averages, filtering by date ranges, grouping by year — required careful manual construction. With Prisma, some of that would have been more concise. I think the explicitness was worth it.

### React 19 + TanStack Query

I used TanStack Query for all server state management rather than Redux or Zustand. The motivation was simple: most of the frontend state in a healthcare application is server state — patient records, crisis history, dashboard statistics. TanStack Query's caching, background refetching, and mutation invalidation patterns fit this exactly. I configured it with `retry: false` and `refetchOnWindowFocus: false` globally, because hammering a protected API on every window focus with automatic retries on 401s is a bad experience for users.

Wouter replaced React Router for routing. At 2KB, it's significantly lighter and its API is close enough to React Router that the learning curve was minimal.

### Role-based access control

Every API route is protected by either `requireAuth` or `optionalAuth` middleware. The middleware extracts the JWT, verifies it against `SESSION_SECRET`, attaches the decoded user to `req.user`, and either short-circuits with a 401 or continues. Authorization logic (checking that only a DOCTOR or ADMIN can access the full patient list, for example) lives in the route handlers themselves rather than in middleware, which keeps it visible and auditable.

---

## Architecture

The system has three tiers:

**React SPA (client):** Fetches data through generated React Query hooks. Authentication state is managed through `AuthContext`, which reads the JWT from `localStorage` and injects it as a Bearer token on every outgoing request via a custom fetch wrapper. The sidebar renders navigation items conditionally based on the authenticated user's role.

**Express 5 API server (server):** Handles all business logic. Routes validate request bodies with Zod schemas before touching the database. Responses are also validated before being sent, which prevents accidentally leaking fields that weren't intended to be public. Structured JSON logging through Pino makes production log analysis tractable.

**PostgreSQL (data):** Eleven tables with proper foreign key relationships, enum types for constrained values (genotypes, blood types, roles, status values), and no nullable fields where nullability isn't semantically meaningful. Schema managed with Drizzle Kit's `push` command for development.

One architectural decision worth explaining: I kept the genetic calculator logic entirely server-side. The Punnett square calculation is simple enough to run in the browser, but keeping it on the server meant I could save calculation results for authenticated users, audit the computation, and eventually replace or improve the algorithm without requiring client updates.

---

## Technical Challenges

**Designing the genotype system:**
The sickle cell genotype system is not just a label — it drives the pregnancy risk calculator, the patient filtering, and the educational content targeting. Getting the enum values right (SS, SC, AS, AA, AC, CC) and ensuring consistency between the database schema, the Zod validators, and the frontend Select components required careful coordination. Early in development, the frontend Select options used different string formats than the database enum, which caused silent failures on form submission.

**The crisis statistics endpoint:**
The `GET /api/stats/crises-by-month` endpoint needs to group crisis records by month and year, compute average intensity per month, and filter by the requesting user's patient ID. Writing this in Drizzle required building the grouping manually with SQL expressions. The initial implementation had a bug where the year filter wasn't applied correctly — the query returned data across years when the `year` query param was provided. This was caught during manual testing and fixed by adding an explicit year comparison in the WHERE clause.

**Token lifecycle:**
The initial JWT expiry was set to 1 hour. During development, I kept getting logged out mid-session, which made testing cumbersome. I extended it to 7 days for the development and initial production configuration. This is a known security tradeoff — a longer-lived token without a refresh mechanism means a stolen token is valid for longer. For the intended deployment context, I judged this acceptable, but I've documented it as something to revisit with a proper refresh token rotation system.

**The `Bearer null` bug:**
Early on, the custom fetch wrapper was injecting `Authorization: Bearer null` on requests made before the user logged in, because the token key wasn't in `localStorage` and `localStorage.getItem()` returns `null`. Protected endpoints were rejecting these requests with 401s, but the error message was confusing. The fix was to check whether the token value was truthy before injecting the header.

**Sidebar active state:**
Wouter doesn't expose a built-in active link concept like React Router's `NavLink`. I implemented the active highlight by comparing the current path from `useLocation()` against each navigation item's path prefix. The initial implementation used exact string equality, which meant `/crises/stats` didn't highlight the "Crises" nav item. Switching to a `startsWith` check fixed it.

---

## What This Project Taught Me

**Schema design has compounding effects.** Every decision I made in the database schema — the genotype enum, the risk level calculation, the blood type values — propagated forward through Zod validators, API responses, and frontend components. A schema decision made on day two was still affecting me eight weeks later. I came out of this project with a much stronger instinct for spending time on the data model before writing routes.

**Contract-first development is worth the upfront cost.** Defining the OpenAPI spec before implementing routes felt slow at the start. By week three, I couldn't imagine going back to the alternative. The generated hooks were correct by construction. When I changed an endpoint's response shape, the TypeScript errors in the frontend told me exactly what needed to be updated.

**Drizzle ORM rewards patience.** The verbose syntax for complex queries frustrated me initially. By the end of the project, I had a much better understanding of the SQL being generated, which made debugging easier and gave me more confidence in the query performance characteristics.

**Role-based UI requires discipline.** Hiding navigation items and data from users who shouldn't see them is easy to get wrong in subtle ways. I learned to think of RBAC as two separate problems: server-side (enforced, non-negotiable) and client-side (convenience, not security). The server must enforce access controls independently of whatever the client displays.

---

## If I Were Starting Over Today

**I would add tests from the beginning.** The Punnett square calculator is a pure function with well-defined inputs and outputs — it's an ideal candidate for unit testing. The auth middleware logic is another. I wrote no automated tests during this project. I relied on manual testing throughout, which worked, but made refactoring slower and less confident. If I were starting today, I'd set up Vitest on day one and write tests alongside the functions.

**I would implement refresh token rotation.** The current single-JWT approach is straightforward but has the weakness described above. A proper implementation would issue a short-lived access token (15 minutes) and a long-lived refresh token stored in an httpOnly cookie, with a rotation endpoint that exchanges a valid refresh token for a new pair.

**I would reconsider the monorepo scope for a first version.** The four-package library structure (`db`, `api-spec`, `api-client-react`, `api-zod`) was the right architecture for maintainability, but it added setup overhead at the start. For a first iteration, I might have kept `db` and `api-zod` as directories inside the API server and extracted them into separate packages once the boundaries were stable.

**I would add pagination on list endpoints from day one.** Currently, `/api/patients`, `/api/crises`, and `/api/education` return all matching records. For a small dataset this is fine. For a deployed system with real patient data, this needs cursor-based or offset pagination with a reasonable default page size.

**Docker Compose for local development.** The current setup requires a locally installed PostgreSQL instance. A `docker-compose.yml` that starts the database (and optionally the API server) would reduce the setup barrier for contributors and make the development environment reproducible.

---

## Impact

DrepaConnect addresses a real gap. In an environment where sickle cell disease management is done on paper, this platform offers:

- A structured crisis log that a doctor can actually query — not just a notebook entry
- Medication adherence tracking that surfaces gaps in treatment
- A pregnancy risk tool that gives families concrete probability information instead of vague advice
- A searchable blood donor registry that could reduce the time to find a compatible donor in an emergency
- A national statistics view that doesn't exist anywhere in a digital form today

For a healthcare organization deploying this, the direct operational benefits are the crisis log and medication tracker. The longer-term benefit is the data — structured, timestamped records that make it possible to study treatment outcomes, crisis patterns, and disease prevalence over time.

---

## Skills Demonstrated

**Frontend**
React 19, TanStack Query (server state management, mutation invalidation, cache configuration), Wouter (SPA routing), Tailwind CSS, Radix UI, shadcn/ui, Framer Motion, Recharts (LineChart, PieChart, BarChart), React Hook Form, Zod (client-side validation), role-conditional rendering, protected routes, localStorage token management

**Backend**
Node.js, Express 5, RESTful API design, JWT authentication, bcryptjs password hashing, Zod input/output validation, Pino structured logging, middleware composition (`requireAuth`, `optionalAuth`), aggregate SQL queries (grouping, averaging, date filtering), partial PATCH update patterns

**Database**
PostgreSQL, Drizzle ORM, schema design with enum types and foreign key constraints, complex JOIN queries (users → patients), aggregate queries for statistics, Drizzle Kit schema push workflow

**API Design**
OpenAPI 3.0 specification, Orval codegen (React Query hooks + Zod schemas), contract-first development, consistent error response shapes, public/protected/optional-auth endpoint patterns

**Architecture**
pnpm monorepo with TypeScript project references, shared library packages, esbuild bundler for production API, Vite for frontend, strict TypeScript configuration across all packages, separation of concerns between schema, validation, API contract, and UI layers

**Security**
JWT-based auth with role claims, bcrypt password hashing, Authorization header injection, server-side role enforcement independent of client-side display logic

---

## What a Recruiter Should Take Away

DrepaConnect is not a tutorial project. The problem domain is specific, the data model is non-trivial, and the feature set — multi-role authentication, a real statistical dashboard, a genetic calculator backed by a proper algorithm — required genuine design decisions at every layer.

The architecture choices (monorepo, contract-first API, Drizzle ORM over Prisma, TanStack Query over Redux) are deliberate and defensible, not cargo-culted. I can explain why each one was made and what the tradeoffs are.

The bugs I encountered and fixed — the Bearer null injection, the crisis stats year filter, the sidebar active state — are the kind of bugs that appear when you're building real software, not following a tutorial. Finding and fixing them required understanding how the system worked as a whole.

What this project demonstrates most clearly is the ability to take an ambiguous real-world problem, design a data model and API that addresses it correctly, and build a complete full-stack implementation without shortcuts in the parts that matter — type safety, input validation, access control, and data consistency.

---

## Executive Summary

DrepaConnect is a production-architecture full-stack web platform built to digitalize sickle cell disease patient management in Central Africa. The system manages patients, crisis history, medications, pregnancies, genetic risk calculations, blood donations, healthcare centers, and educational content — all behind a role-based JWT authentication layer.

Built with React 19, Express 5, PostgreSQL, and Drizzle ORM inside a pnpm monorepo, the project demonstrates end-to-end TypeScript type safety, contract-first API design via OpenAPI + Orval codegen, and a clean separation between data schema, validation logic, API contract, and UI layer.

The technical decisions — Drizzle over Prisma for SQL predictability, TanStack Query over Redux for server state, wouter for lightweight routing, explicit OpenAPI spec before implementation — reflect a developer who thinks about maintainability and correctness before convenience.

The project solves a genuine problem. It was designed and built from scratch, with real architecture decisions, real bugs, and real tradeoffs. It is the kind of work that reflects how I actually approach software development.

---

*DrepaConnect · github.com/IneeAceFullStack/drepaconnect · ololoppd@gmail.com*
