<div align="center">

<img src="https://img.shields.io/badge/DrepaConnect-Plateforme%20Santé-DC2626?style=for-the-badge&logo=heart&logoColor=white" alt="DrepaConnect" />

# DrepaConnect

### Plateforme Web Santé Full-Stack · Gestion de la Drépanocytose

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=flat-square&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Licence: MIT](https://img.shields.io/badge/Licence-MIT-yellow.svg?style=flat-square)](LICENSE)

**Une API REST + SPA React prête pour la production, conçue pour numériser la prise en charge de la drépanocytose en Afrique centrale.**

[Présentation](#-présentation) · [Fonctionnalités](#-fonctionnalités) · [Architecture](#-architecture) · [Stack technique](#-stack-technique) · [Installation](#-installation) · [Configuration](#-configuration) · [Base de données](#-schéma-de-la-base-de-données) · [API](#-référence-api) · [Améliorations](#-améliorations-futures) · [Auteure](#-auteure)

</div>

---

## 📋 Présentation

**DrepaConnect** est une plateforme web de santé complète conçue pour combler le manque d'outils numériques dédiés à la gestion de la drépanocytose en Afrique centrale. La drépanocytose touche environ **4,5 % de la population** en République du Congo — ce qui en fait le trouble génétique le plus répandu dans la région — mais les outils de gestion numérique spécialisés restent quasi inexistants.

La plateforme réunit plusieurs types d'utilisateurs au sein d'un seul écosystème :

| Rôle | Description |
|------|-------------|
| 🩺 **Patient** | Enregistre ses crises, gère ses médicaments, suit sa grossesse, consulte son carnet de santé |
| 🏥 **Médecin** | Consulte les dossiers patients, surveille les tendances de crises, coordonne les soins |
| 🩸 **Donneur** | S'inscrit, signale sa disponibilité, répond aux demandes urgentes de sang |
| 🧬 **Public** | Utilise le calculateur génétique, trouve les centres de dépistage, consulte les modules éducatifs |
| ⚙️ **Admin** | Supervision complète de la plateforme et des statistiques nationales |

### Chiffres clés

- **14 tables** en base de données — entièrement typées avec Drizzle ORM + PostgreSQL
- **12 modules de routes** REST API — documentés en OpenAPI et générés avec Orval
- **14 pages** frontend — construites avec React 19 et TanStack Query
- **5 rôles utilisateurs** — contrôle d'accès granulaire sur chaque endpoint protégé
- **Conception API contract-first** — spec OpenAPI → hooks React Query + schémas Zod auto-générés

---

## ✨ Fonctionnalités

### 🔐 Authentification & Autorisations
- Authentification JWT avec durée de vie de 7 jours
- Hachage des mots de passe avec `bcryptjs` et salt
- Contrôle d'accès basé sur les rôles (RBAC) sur tous les endpoints protégés
- Middlewares `requireAuth` / `optionalAuth` pour une protection granulaire des routes
- Persistence du token dans le `localStorage` avec injection automatique sur chaque appel API

### 🩺 Gestion des patients
- Profils patients complets avec génotype drépanocytaire (SS, SC, AS, AA, AC, CC)
- Liste patients réservée aux médecins, avec recherche par nom et filtre par génotype
- Mises à jour PATCH partielles — seuls les champs modifiés sont écrits en base
- Jointure patient-utilisateur pour la résolution du nom dans toutes les requêtes

### 🚨 Journal des crises douloureuses
- Enregistrement des crises : intensité (1–10), localisation corporelle, symptômes, déclencheurs, traitement
- Indicateur de passage aux urgences par crise
- Graphiques de tendance mensuelle (Recharts `LineChart`) — nombre et intensité moyenne
- Statistiques récapitulatives : total, intensité moyenne, crises ce mois, hospitalisations
- CRUD complet — création, lecture, modification, suppression

### 💊 Suivi des médicaments
- Médicaments actifs avec dosage, fréquence et horaires de prise
- Action "Médicament pris" en un clic avec horodatage précis (`lastTaken`)
- Suivi de l'observance thérapeutique dans le temps

### 🤰 Suivi de grossesse
- Suivi de grossesse active avec affichage de la semaine gestationnelle
- Calcul automatique du niveau de risque (CRITIQUE / ÉLEVÉ / MODÉRÉ / FAIBLE) selon le génotype du partenaire, basé sur un algorithme dérivé du carré de Punnett
- Suivi de la date d'accouchement prévue avec compteur de semaines

### 🧬 Calculateur de risque génétique
- Implémentation complète du carré de Punnett pour les probabilités de transmission
- Répartition des probabilités pour tous les génotypes possibles chez l'enfant
- Classification du niveau de risque avec conseils médicaux personnalisés
- Historique des calculs pour les utilisateurs connectés (20 derniers résultats)
- Accessible publiquement — aucun compte requis

### 🩸 Réseau de donneurs de sang
- Annuaire de donneurs consultable — filtre par groupe sanguin, ville, disponibilité
- Endpoint de basculement de disponibilité (`PATCH /api/donors/:id/availability`)
- Tableau des demandes urgentes avec cycle de vie OPEN / FULFILLED / CANCELLED
- Lecture publique — aucun compte nécessaire pour consulter les demandes

### 🏥 Répertoire des centres de santé
- Centres de transfusion et de dépistage néonatal dans les provinces du Congo
- Filtrage par province et par ville
- Services proposés, horaires d'ouverture, coordonnées GPS (lat/long), contact

### 📊 Tableau de bord & Statistiques nationales
- Tableau de bord personnel avec widgets de santé en temps réel (crises, médicaments, donneurs disponibles)
- Affichage conditionnel selon le rôle — les médecins voient les compteurs patients, les patients voient leurs propres données
- Statistiques nationales : répartition par province et par génotype, disponibilité des donneurs
- Visualisations interactives Recharts `PieChart` et `BarChart`

### 📚 Bibliothèque éducative
- Modules catégorisés : NOTIONS DE BASE, GÉNÉTIQUE, SYMPTÔMES, TRAITEMENT
- Ciblage d'audience : patients, parents, professionnels de santé
- Support vidéo et image par module
- Contenu initial seedé — opérationnel dès le premier démarrage

---

## 🏗 Architecture

DrepaConnect suit une **architecture monorepo** gérée avec `pnpm workspaces`, avec une séparation stricte des responsabilités en packages indépendants reliés par des références TypeScript.

```
┌─────────────────────────────────────────────────────────────┐
│                      NAVIGATEUR CLIENT                       │
│                    React 19 + Vite SPA                       │
│   wouter · TanStack Query · Radix UI · Tailwind · Recharts  │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS / REST JSON
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    SERVEUR API EXPRESS 5                     │
│         Auth JWT · Validation Zod · Logs Pino               │
│                                                              │
│  /api/auth  /api/patients  /api/crises  /api/medications    │
│  /api/donors  /api/blood-requests  /api/centers             │
│  /api/pregnancy  /api/genetic  /api/stats  /api/education   │
└──────────────────────────┬──────────────────────────────────┘
                           │ Drizzle ORM (SQL typé)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      POSTGRESQL 16                           │
│              14 tables · ENUMs · Clés étrangères            │
└─────────────────────────────────────────────────────────────┘
```

### Carte des packages du monorepo

```
drepaconnect/
├── artifacts/
│   ├── api-server/           # API REST Express 5 (Node.js, bundle CJS via esbuild)
│   │   └── src/
│   │       ├── routes/       # 12 modules de routes
│   │       ├── middleware/   # requireAuth, optionalAuth
│   │       ├── lib/          # utilitaires auth, singleton logger
│   │       └── index.ts
│   └── web/                  # SPA React 19 + Vite
│       └── src/
│           ├── pages/        # 14 composants de pages
│           ├── components/   # UI partagée (Sidebar, Shell, widgets)
│           ├── context/      # AuthContext
│           └── App.tsx
├── lib/
│   ├── db/                   # Schémas Drizzle (14 tables) — source de vérité
│   ├── api-spec/             # openapi.yaml + config Orval
│   ├── api-client-react/     # Hooks générés + custom-fetch (injection Bearer)
│   └── api-zod/              # Schémas Zod partagés (validation côté serveur)
├── scripts/                  # Scripts utilitaires
├── pnpm-workspace.yaml       # Catalog + overrides du workspace
├── tsconfig.base.json        # Config TS stricte partagée
└── tsconfig.json             # Fichier solution (libs composites uniquement)
```

### Flux de données — Conception API contract-first

```
openapi.yaml  ──[codegen Orval]──▶  hooks React Query  (api-client-react)
                                ──▶  schémas Zod        (api-zod)

Routes serveur  ──[Zod.parse()]──▶  corps de requête validé
                ──[Drizzle]─────▶  requêtes SQL typées
                ──[Zod.parse()]──▶  forme de réponse validée
```

---

## 🛠 Stack technique

### Frontend

| Technologie | Version | Rôle |
|-------------|---------|------|
| [React](https://react.dev/) | 19 | Framework de composants UI |
| [Vite](https://vitejs.dev/) | 6 | Outil de build & serveur HMR |
| [Wouter](https://github.com/molefrog/wouter) | 3 | Routeur SPA léger (2 Ko) |
| [TanStack Query](https://tanstack.com/query) | 5 | État serveur, cache, synchronisation en arrière-plan |
| [Tailwind CSS](https://tailwindcss.com/) | 4 | Framework CSS utilitaire |
| [Radix UI](https://www.radix-ui.com/) | latest | Primitives de composants accessibles |
| [shadcn/ui](https://ui.shadcn.com/) | latest | Couche de composants pré-construits sur Radix |
| [Framer Motion](https://www.framer.com/motion/) | 12 | Bibliothèque d'animations |
| [Recharts](https://recharts.org/) | 2 | Bibliothèque de graphiques composables |
| [React Hook Form](https://react-hook-form.com/) | 7 | Gestion performante des formulaires |
| [Zod](https://zod.dev/) | 4 | Validation de schémas (partagée avec le serveur) |

### Backend

| Technologie | Version | Rôle |
|-------------|---------|------|
| [Node.js](https://nodejs.org/) | 24 | Runtime JavaScript |
| [Express](https://expressjs.com/) | 5 | Serveur HTTP & pile de middlewares |
| [Drizzle ORM](https://orm.drizzle.team/) | latest | ORM PostgreSQL avec typage strict |
| [PostgreSQL](https://www.postgresql.org/) | 16 | Base de données relationnelle principale |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) | 9 | Signature et vérification JWT |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | 3 | Hachage des mots de passe |
| [Pino](https://getpino.io/) | 9 | Logs structurés au format JSON |
| [Zod](https://zod.dev/) | 4 | Validation des entrées/sorties |

### Outillage & Infrastructure

| Technologie | Rôle |
|-------------|------|
| [pnpm workspaces](https://pnpm.io/workspaces) | Gestion des packages en monorepo |
| [TypeScript](https://www.typescriptlang.org/) 5.9 | Typage statique de bout en bout |
| [Orval](https://orval.dev/) | OpenAPI → hooks React Query + schémas Zod |
| [esbuild](https://esbuild.github.io/) | Bundler ultra-rapide pour le serveur API |
| [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview) | Migrations & `db push` |

---

## 🚀 Installation

### Prérequis

- **Node.js** 20 ou supérieur — [nodejs.org](https://nodejs.org/)
- **pnpm** 9 ou supérieur — `npm install -g pnpm`
- **PostgreSQL** 15 ou supérieur — [postgresql.org](https://www.postgresql.org/download/)

### Étape 1 — Cloner le dépôt

```bash
git clone https://github.com/IneeAceFullStack/drepaconnect.git
cd drepaconnect
```

### Étape 2 — Installer toutes les dépendances du workspace

```bash
pnpm install
```

### Étape 3 — Configurer les variables d'environnement

```bash
cp artifacts/api-server/.env.example artifacts/api-server/.env
```

Éditez le fichier avec vos valeurs (voir [Configuration](#-configuration) ci-dessous).

### Étape 4 — Créer la base de données

```bash
createdb drepaconnect
```

### Étape 5 — Appliquer le schéma

```bash
pnpm --filter @workspace/db run push
```

### Étape 6 — Démarrer les serveurs de développement

```bash
# Terminal 1 — Serveur API (port 5000)
pnpm --filter @workspace/api-server run dev

# Terminal 2 — Frontend React (port 5173)
pnpm --filter @workspace/web run dev
```

Ouvrez [http://localhost:5173](http://localhost:5173) dans votre navigateur.

---

## ⚙️ Configuration

### Variables d'environnement requises

Créez le fichier `artifacts/api-server/.env` :

```env
# ─── Base de données ────────────────────────────────────────
DATABASE_URL=postgresql://postgres:motdepasse@localhost:5432/drepaconnect

# ─── Authentification ────────────────────────────────────────
SESSION_SECRET=remplacez-par-une-cle-aleatoire-minimum-32-caracteres

# ─── Serveur ─────────────────────────────────────────────────
PORT=5000
NODE_ENV=development
```

### Référence des variables d'environnement

| Variable | Obligatoire | Description |
|----------|-------------|-------------|
| `DATABASE_URL` | ✅ | Chaîne de connexion PostgreSQL |
| `SESSION_SECRET` | ✅ | Clé de signature JWT — 32 caractères minimum |
| `PORT` | Optionnel | Port du serveur API (défaut : `5000`) |
| `NODE_ENV` | Optionnel | `development` ou `production` |

### Régénérer le client API (après modification de la spec OpenAPI)

```bash
pnpm --filter @workspace/api-spec run codegen
```

### Lancer une vérification de types complète

```bash
pnpm run typecheck
```

---

## 🗄 Schéma de la base de données

Géré avec **Drizzle ORM** — tous les schémas sont définis dans `lib/db/src/schema/` et constituent la source de vérité unique.

### Vue d'ensemble des tables

| Table | Champs clés | Remarques |
|-------|------------|-----------|
| `users` | `id`, `name`, `email`, `passwordHash`, `role`, `phone`, `createdAt` | Enum rôle : PATIENT · DOCTOR · DONOR · HELPER · ADMIN |
| `patients` | `id`, `userId`, `sickleType`, `dateOfBirth`, `city`, `province` | Enum génotype : SS · SC · AS · AA · AC · CC |
| `medical_records` | `id`, `patientId`, `type`, `date`, `notes`, `hemoglobinLevel` | Enum type : CONSULTATION · LAB_RESULT · TRANSFUSION · VACCINATION · HOSPITALIZATION · OTHER |
| `crises` | `id`, `patientId`, `date`, `intensity`, `location`, `symptoms`, `triggers`, `treatment`, `hospitalVisit` | Intensité 1–10 |
| `medications` | `id`, `patientId`, `name`, `dosage`, `frequency`, `times`, `active`, `lastTaken` | |
| `pregnancies` | `id`, `patientId`, `startDate`, `expectedDate`, `currentWeek`, `partnerSickleType`, `riskLevel` | Enum risque : CRITICAL · HIGH · MODERATE · LOW |
| `genetic_calculations` | `id`, `userId`, `parent1Type`, `parent2Type`, `riskLevel`, `probabilities`, `createdAt` | `probabilities` stocké en JSON |
| `blood_donors` | `id`, `userId`, `bloodType`, `city`, `available`, `lastDonation`, `donationCount` | Enum groupe : A_POS · A_NEG · B_POS · B_NEG · AB_POS · AB_NEG · O_POS · O_NEG |
| `blood_requests` | `id`, `requestedBy`, `bloodType`, `urgent`, `message`, `status`, `respondedBy` | Enum statut : OPEN · FULFILLED · CANCELLED |
| `screening_centers` | `id`, `name`, `city`, `province`, `lat`, `long`, `services`, `openingHours`, `phone`, `active` | |
| `education_modules` | `id`, `title`, `category`, `targetAudience`, `content`, `readTime`, `videoUrl`, `imageUrl` | Enum catégorie : BASICS · GENETICS · SYMPTOMS · TREATMENT |

### Relations entre entités (simplifié)

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

## 📡 Référence API

URL de base : `http://localhost:5000/api`

Authentification : `Authorization: Bearer <jwt_token>`

### Authentification

| Méthode | Endpoint | Auth | Corps | Réponse |
|---------|----------|------|-------|---------|
| `POST` | `/auth/register` | — | `{ name, email, password, role, phone? }` | `{ user, token }` |
| `POST` | `/auth/login` | — | `{ email, password }` | `{ user, token }` |
| `GET` | `/auth/me` | ✅ | — | `{ user }` |

### Patients

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| `GET` | `/patients` | ✅ DOCTOR/ADMIN | Liste avec recherche par nom et filtre génotype |
| `POST` | `/patients` | ✅ | Créer un profil patient |
| `GET` | `/patients/:id` | ✅ | Obtenir un profil patient |
| `PATCH` | `/patients/:id` | ✅ | Mise à jour partielle |

### Dossiers médicaux

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| `GET` | `/medical-records` | ✅ | Lister les entrées (filtre : `patientId`, `type`) |
| `POST` | `/medical-records` | ✅ | Créer une entrée |
| `PATCH` | `/medical-records/:id` | ✅ | Modifier une entrée |
| `DELETE` | `/medical-records/:id` | ✅ | Supprimer une entrée |

### Crises

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| `GET` | `/crises` | ✅ | Lister les crises du patient courant |
| `POST` | `/crises` | ✅ | Enregistrer une nouvelle crise |
| `PATCH` | `/crises/:id` | ✅ | Modifier une crise |
| `DELETE` | `/crises/:id` | ✅ | Supprimer une crise |
| `GET` | `/crises/stats/summary` | ✅ | Stats récapitulatives |

### Médicaments

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| `GET` | `/medications` | ✅ | Lister les médicaments actifs |
| `POST` | `/medications` | ✅ | Ajouter un médicament |
| `PATCH` | `/medications/:id` | ✅ | Modifier un médicament |
| `DELETE` | `/medications/:id` | ✅ | Supprimer un médicament |
| `POST` | `/medications/:id/take` | ✅ | Enregistrer une prise (met à jour `lastTaken`) |

### Sang & Donneurs

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| `GET` | `/donors` | — | Lister les donneurs (filtre : `bloodType`, `city`, `available`) |
| `POST` | `/donors` | ✅ | S'inscrire comme donneur |
| `PATCH` | `/donors/:id` | ✅ | Mettre à jour le profil donneur |
| `PATCH` | `/donors/:id/availability` | ✅ | Basculer la disponibilité |
| `GET` | `/blood-requests` | — | Lister les demandes (filtre : `status`, `bloodType`) |
| `POST` | `/blood-requests` | optionnel | Créer une demande de sang |
| `PATCH` | `/blood-requests/:id` | ✅ | Modifier une demande |
| `POST` | `/blood-requests/:id/respond` | ✅ | Répondre — passe le statut à FULFILLED |

### Statistiques

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| `GET` | `/stats/dashboard` | ✅ | Résumé personnel + crises récentes + demandes ouvertes |
| `GET` | `/stats/national` | — | Compteurs nationaux, par province, par génotype |
| `GET` | `/stats/crises-by-month` | ✅ | Données de tendance mensuelle |

### Calculateur génétique

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| `POST` | `/genetic/calculate` | optionnel | Calcul Punnett, sauvegardé si authentifié |
| `GET` | `/genetic/history` | ✅ | 20 derniers calculs sauvegardés |

### Éducation

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| `GET` | `/education` | — | Lister les modules (filtre : `category`, `audience`) |
| `GET` | `/education/:id` | — | Contenu complet d'un module |
| `POST` | `/education` | ✅ ADMIN | Créer un module |
| `PATCH` | `/education/:id` | ✅ ADMIN | Modifier un module |

### Centres de santé

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| `GET` | `/centers` | — | Lister les centres (filtre : `city`, `province`) |
| `GET` | `/centers/:id` | — | Détails d'un centre |
| `POST` | `/centers` | ✅ ADMIN | Ajouter un centre |
| `PATCH` | `/centers/:id` | ✅ ADMIN | Modifier un centre |

> **Auth :** ✅ = JWT requis · optionnel = fonctionne avec ou sans token · — = endpoint public

---

## 🖼 Captures d'écran

> _Captures d'écran de l'application déployée._

| Tableau de bord | Journal des crises | Calculateur génétique |
|----------------|-------------------|----------------------|
| Résumé de santé personnel avec widgets et graphiques | Journal chronologique des crises avec visualisation de l'intensité | Résultats du carré de Punnett avec répartition des probabilités |

| Réseau de donneurs | Bibliothèque éducative | Statistiques nationales |
|--------------------|----------------------|------------------------|
| Annuaire consultable avec statut de disponibilité | Modules de santé catégorisés par audience | Graphiques de distribution par province et génotype |

---

## 🔮 Améliorations futures

### Impact élevé (Portfolio / Recherche d'emploi)

| Amélioration | Impact |
|-------------|--------|
| **Notifications en temps réel** (WebSocket / Socket.io) pour les demandes urgentes de sang | Élevé — démontre la maîtrise des systèmes temps réel |
| **Support PWA** (service worker, mode hors ligne) pour les environnements à faible connectivité | Élevé — répond directement au contexte africain |
| **Notifications par email** (Nodemailer / Resend) pour les alertes de crise et les demandes de sang | Moyen-Élevé |
| **Upload de fichiers** (pièces jointes aux dossiers médicaux, PDF de résultats de labo) | Moyen-Élevé |
| **Prise de rendez-vous** entre patients et médecins | Élevé — fonctionnalité de santé majeure manquante |
| **Intégration cartographique** (Mapbox / Leaflet) pour la localisation des centres | Moyen |
| **Interface de gestion des rôles** pour les administrateurs | Moyen |
| **Logs d'audit** — traçabilité des accès et modifications des dossiers sensibles | Moyen — conformité santé |

### Améliorations techniques

| Amélioration | Impact |
|-------------|--------|
| **Tests end-to-end** (Playwright / Cypress) | Élevé — démontre la maturité en tests |
| **Tests unitaires** (Vitest) pour le calculateur Punnett et les helpers d'auth | Élevé |
| **Docker Compose** pour le développement local | Élevé — signal DevOps |
| **Pipeline CI/CD** (GitHub Actions) avec lint + typecheck + tests | Élevé |
| **Rate limiting** de l'API (express-rate-limit) | Moyen — sécurité |
| **Pagination** sur tous les endpoints de liste | Moyen |
| **Internationalisation** (i18n) — basculement français/anglais | Moyen — pertinent pour le contexte congo |
| **Rotation des refresh tokens** pour remplacer l'authentification à token unique | Moyen — sécurité |

---

## 👤 Auteure

**Pascale Perspicasse Destinée OLOLO**
*Développeuse Full-Stack · TypeScript · React · Node.js · PostgreSQL*

- 🌐 GitHub : [IneeAceFullStack](https://github.com/IneeAceFullStack)
- 📧 Email : [ololoppd@gmail.com](mailto:ololoppd@gmail.com)
- 💼 LinkedIn : [Pascale Perspicasse Destinée OLOLO](https://www.linkedin.com/in/pascale-perspicasse-destinée-ololo-07474b374)

---

## 📄 Licence

Ce projet est sous licence **MIT** — consultez le fichier [LICENSE](LICENSE) pour plus de détails.

---

<div align="center">

Développé avec engagement pour les patients drépanocytaires d'Afrique centrale 🇨🇬

**DrepaConnect** · [Signaler un bug](https://github.com/IneeAceFullStack/drepaconnect/issues) · [Demander une fonctionnalité](https://github.com/IneeAceFullStack/drepaconnect/issues)

---

*Mots-clés : React · TypeScript · Node.js · Express · PostgreSQL · Drizzle ORM · API REST · JWT · TanStack Query · Tailwind CSS · Monorepo · pnpm workspaces · OpenAPI · Santé numérique · Full-Stack*

</div>
