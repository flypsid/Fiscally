## Tech Stack & Architecture Principles - Fiscally

### 🧱 Core Technologies (Projet Actuel)

- **Language**: TypeScript (`strict` mode enabled — avoid `any`, prefer `unknown` / `never`)
- **Frontend**: React 19.0.0 / Next.js 15.3.4 (`App Router` only)
- **UI Layer**: Radix UI + Tailwind CSS 4 (composants personnalisés)
- **Backend**: Next.js API Routes + TypeScript
- **Database**: **PostgreSQL** hosted on **Neon** avec **Drizzle ORM 0.44.3**

### 🔄 ORM Strategy (Fiscally)

- **Drizzle ORM 0.44.3**: Choisi pour ce projet pour un contrôle maximal avec **Better Auth 1.3.2**
- **Provider**: PostgreSQL (`pg`) avec adaptateur Drizzle pour Better Auth
- **Migrations**: Gérées via `drizzle-kit 0.31.4`
- **Type Safety**: Schémas typés avec inférence automatique

**Justification**: Drizzle offre un contrôle précis des migrations et une intégration native avec Better Auth.

### 🎨 UI/UX Layer (Fiscally)

- **Design System**: Radix UI primitives avec Tailwind CSS 4
- **Icons**: Tabler Icons React 3.34.0 + Lucide React 0.522.0
- **Animations**: Framer Motion 12.23.6
- **Themes**: next-themes 0.4.6 (dark/light mode)
- **Notifications**: Sonner 2.0.6
- **Drag & Drop**: @dnd-kit/core 6.3.1 (avec sortable et modifiers)

### 📥 Validation & Schema Definition (Fiscally)

- **Zod 3.25.76**: Obligatoire pour toute validation (formulaires, API, modèles)
- **Architecture**: Schémas partagés entre client et serveur (`src/lib/schemas/`)
- **Middlewares**: Validation automatique avec `withValidation`, `withAuth`, `withValidationAndAuth`
- **Traductions**: Support des messages d'erreur localisés via next-intl
- **Type Safety**: Inférence automatique des types TypeScript

### 🌍 Internationalization (Fiscally)

- **next-intl 4.1.0**: Système i18n complet avec routing dynamique
- **Architecture**: Namespaces par fonctionnalité (auth, dashboard, etc.)
- **SSR**: Compatible avec App Router et Server Components
- **Validation**: Messages d'erreur Zod traduits automatiquement

**Usage Patterns**:

```tsx
// Server Components
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("auth");
  return <h1>{t("login.title")}</h1>;
}

// Client Components avec validation
const loginSchema = createLoginSchema(t);
```

### 📊 Data & State Management (Fiscally)

- **Tables**: @tanstack/react-table 8.21.3 pour les interfaces de données
- **Charts**: Recharts 2.15.4 pour les visualisations
- **State**: React hooks + Context API (pas de store global complexe)
- **Forms**: React Hook Form avec validation Zod intégrée
- **Fetching**: Fetch natif avec middlewares de validation

### 📐 Architecture & Design Patterns (Fiscally)

- **Structure**: App Router avec organisation par fonctionnalité

  ```
  src/
  ├── app/[locale]/(auth)/     # Pages d'authentification
  ├── components/auth/         # Composants d'auth réutilisables
  ├── lib/schemas/            # Schémas Zod partagés
  ├── lib/middleware/         # Middlewares de validation
  ├── hooks/                  # Custom hooks (useAuth, etc.)
  └── db/                     # Schémas et configuration DB
  ```

- **API Layer**: Next.js API Routes avec middlewares de validation

  - **Better Auth**: Endpoints centralisés (`/api/auth/[...all]`)
  - **Protected APIs**: Validation + authentification obligatoires
  - **Type Safety**: Schémas Zod pour input/output

- **Error Handling**:

  - Validation Zod avec messages traduits
  - Middlewares d'erreur standardisés
  - Logging structuré pour le debugging

- **State Management**:

  - **Local state**: React hooks (useState, useReducer)
  - **Auth state**: Custom hook `useAuth` avec Context
  - **Server state**: Pas de cache complexe, fetch direct

- **Hooks**: Logique métier encapsulée (`useAuth`, validation forms)

### ⚙️ DX & Quality Standards (Fiscally)

- **Linting**: ESLint 9 avec config Next.js
- **Type Checking**: TypeScript 5 en mode strict
- **Styling**: Tailwind CSS 4 avec PostCSS
- **Dev Tools**:

  - `tsx 4.20.3` pour l'exécution TypeScript
  - `drizzle-kit 0.31.4` pour les migrations
  - Next.js Turbopack pour le dev rapide

- **Build Process**:

  ```bash
  npm run lint     # ESLint + type checking
  npx tsc --noEmit # Vérification TypeScript
  npm run build    # Build Next.js optimisé
  ```

- **Database Workflow**:
  ```bash
  npx drizzle-kit generate  # Générer migrations
  npx drizzle-kit migrate   # Appliquer migrations
  npx drizzle-kit studio   # Interface admin DB
  ```

---

## 🎯 Règles de Développement Spécifiques - Fiscally

### 🚫 Interdictions

- **Jamais de serveur de développement automatique**: Ne pas lancer `npm run dev` sans demande explicite
- **Pas de technologies non utilisées**: Ne pas suggérer Prisma, tRPC, Zustand, etc.
- **Pas de modifications d'architecture**: Respecter Better Auth + Drizzle + Next.js App Router
- **Pas de secrets en dur**: Toujours utiliser les variables d'environnement

### ✅ Obligations

- **Validation Zod**: Obligatoire pour tous les inputs/outputs
- **Middlewares**: Utiliser `withAuth`, `withValidation`, `withValidationAndAuth`
- **Type Safety**: TypeScript strict, pas de `any`
- **i18n**: Tous les textes utilisateur via next-intl
- **Documentation**: Mettre à jour les docs lors des changements

### 🔧 Workflow de Développement

1. **Avant modification**: Consulter `docs/SECURITY.md` et `docs/VALIDATION_ARCHITECTURE.md`
2. **Validation**: Créer/utiliser schémas Zod partagés
3. **API**: Utiliser les middlewares de validation existants
4. **Auth**: Respecter l'architecture multicouche
5. **Tests**: Vérifier TypeScript + ESLint
6. **Documentation**: Mettre à jour si nécessaire

### 📁 Structure de Fichiers à Respecter

```
src/
├── app/[locale]/               # Pages avec i18n
│   ├── (auth)/                # Groupe d'auth
│   └── api/                   # API Routes
├── components/
│   ├── auth/                  # Composants d'authentification
│   └── ui/                    # Composants UI réutilisables
├── lib/
│   ├── schemas/               # Schémas Zod partagés
│   ├── middleware/            # Middlewares de validation
│   └── auth.ts               # Configuration Better Auth
├── hooks/                     # Custom hooks
├── db/
│   ├── schema.ts             # Schémas Drizzle
│   └── drizzle.ts            # Configuration DB
docs/                          # Documentation projet
└── .trae/rules/              # Règles de développement
```

### 🎨 Standards UI/UX

- **Design System**: Radix UI + Tailwind CSS 4 uniquement
- **Icons**: Tabler Icons ou Lucide React
- **Animations**: Framer Motion pour les transitions
- **Responsive**: Mobile-first avec Tailwind
- **Accessibilité**: Radix UI garantit les standards WCAG

### 🔍 Debugging et Monitoring

- **Logs**: Console.error pour les erreurs serveur
- **Validation**: Messages d'erreur Zod traduits
- **Auth**: Logs des tentatives d'accès non autorisées
- **Performance**: Monitoring des requêtes DB

---

## 🔗 Model Context Protocol (MCP) Setup (Fiscally)

### Context7 MCP — Documentation Access

- **Purpose**: Accès centralisé à la documentation du projet
- **Usage**: Navigation et recherche dans les fichiers de documentation
- **Files**: `docs/SECURITY.md`, `docs/VALIDATION_ARCHITECTURE.md`, `.trae/rules/user_rules.md`
- **Security**: Lecture seule, pas d'accès aux secrets

### 🧠 Agent Guidelines (Fiscally)

- **Documentation**: Toujours consulter les docs avant modifications
- **Architecture**: Respecter les patterns établis (Better Auth + Drizzle)
- **Validation**: Utiliser les middlewares existants
- **Security**: Suivre les pratiques définies dans `SECURITY.md`
- **Types**: Maintenir la type safety avec TypeScript strict

---

## 🔐 Authentication (Better Auth) - Configuration Fiscally

### Configuration Actuelle

**Fichier**: `src/lib/auth.ts`

```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  plugins: [nextCookies()],
});
```

### Schéma de Base de Données (Drizzle)

**Fichier**: `src/db/schema.ts`

Tables Better Auth implémentées :

- ✅ `user` - Utilisateurs avec email/password
- ✅ `session` - Sessions avec expiration et métadonnées
- ✅ `account` - Comptes liés (OAuth futur)
- ✅ `verification` - Tokens de vérification

### Architecture de Sécurité Multicouche

1. **Middleware** (`src/middleware.ts`)

   - Validation de session au niveau requête
   - Redirection automatique si non authentifié

2. **Server Components** (`src/components/auth/ServerProtectedRoute.tsx`)

   - Validation côté serveur obligatoire
   - Protection contre la manipulation client

3. **Client Components** (`src/components/auth/ProtectedRoute.tsx`)
   - UX fluide avec états de chargement
   - Hook `useAuth` pour l'état global

### Middlewares de Validation

**Fichier**: `src/lib/middleware/validation.ts`

- `withAuth`: Protection des API routes
- `withValidation`: Validation Zod des inputs
- `withValidationAndAuth`: Combinaison des deux

### Endpoints Centralisés

**Fichier**: `src/app/api/auth/[...all]/route.ts`

Tous les endpoints Better Auth gérés automatiquement :

- `/api/auth/sign-in`
- `/api/auth/sign-up`
- `/api/auth/sign-out`
- `/api/auth/session`

### Variables d'Environnement Requises

```env
BETTER_AUTH_SECRET=your-32-char-secret
BETTER_AUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://user:pass@host/db
```

### Bonnes Pratiques Implémentées

- ✅ **Type Safety**: Types Better Auth + Drizzle
- ✅ **Validation**: Schémas Zod partagés
- ✅ **Sécurité**: Validation multicouche obligatoire
- ✅ **UX**: États de chargement et redirections
- ✅ **i18n**: Messages d'erreur traduits
- ✅ **Performance**: Middleware optimisé

---

# Development Rules

## Command Suggestions

### Prohibited Commands

- **npm run dev**: Ne jamais suggérer automatiquement cette commande
  - Suggérer uniquement si explicitement demandé par l'utilisateur
  - Cela évite les démarrages non désirés du serveur de développement
- **npm start**: Ne pas suggérer automatiquement
- **yarn dev**: Ne pas suggérer automatiquement
- **pnpm dev**: Ne pas suggérer automatiquement

### Allowed Commands

Les commandes suivantes peuvent être suggérées automatiquement quand pertinentes :

- `npx tsc --noEmit` (Vérification des types TypeScript)
- `npm run build` (Build de production)
- `npm run lint` (Linting du code)
- `npm test` (Exécution des tests)
- `npm audit` (Audit de sécurité)
- `npm install` (Installation des dépendances)
- `npm ci` (Installation propre des dépendances)

## Justification

- L'utilisateur préfère contrôler quand le serveur de développement est lancé
- Évite les processus en arrière-plan non désirés
- Améliore l'expérience utilisateur en évitant les propositions répétitives

## Application

Cette règle s'applique à tous les assistants IA travaillant sur ce projet.
