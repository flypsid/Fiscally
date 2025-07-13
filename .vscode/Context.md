## Tech Stack & Architecture Principles

### 🧱 Core Technologies

- **Language**: TypeScript (`strict` mode enabled — avoid `any`, prefer `unknown` / `never`)
- **Frontend**: React.js / Next.js (`App Router` only), React Native (Expo or Bare)
- **UI Layer**: Shadcn UI (Tailwind + Radix)
- **Backend**: Node.js + TypeScript
- **Database**: **PostgreSQL** hosted on **Neon**, typically accessed via **MCP (Model Context Protocol)** for context-aware and secure connections by AI agents

### 🔄 ORM Strategy

- **DrizzleORM**: Use when **maximum control is needed** — e.g., custom auth flows with **Better Auth**, multi-tenant architecture, or strict migration control
- **Prisma**: Use when the project integrates with **managed auth** solutions like **Clerk**, **Kinde**, or **ShipFast**-like stacks — optimized for speed and ease of use

ORM selection must be **explicitly documented** per project.

### 🌐 Web3 Layer

- **EVM**: Hardhat + Solidity (OpenZeppelin standard — upgradeable only if justified)
- **Cosmos**: CosmWasm (Rust) smart contracts with **InterchainJS** for chain interactions (CosmJS deprecated)
- **Wallet Integration**: Keplr (Cosmos), MetaMask (EVM), optional WalletConnect if multi-chain UX required

### 📥 Validation & Schema Definition

- **Zod**: Mandatory for schema validation (forms, API inputs/outputs, domain models)
  - Prefer Zod over custom validators or raw interfaces
  - Schemas must be colocated with business logic when relevant

### 🌍 Internationalization

- **next-intl**: Required for all i18n needs

  - Use dynamic namespace loading
  - SSR-compatible routing
  - All user-facing text must be translatable

  **Using `getTranslations` (next-intl/server)**

  - For Server Components, Route Handlers, Server Actions, or any server-side logic requiring translations, use the async `getTranslations` function.
  - Example:

    ```tsx
    import { getTranslations } from "next-intl/server";

    export default async function HomePage() {
      const t = await getTranslations("HomePage");
      return <h1>{t("title")}</h1>;
    }
    ```

  - Allows loading translation messages server-side, dynamic value interpolation, and ensures SSR compatibility.
  - Recommended for: metadata generation, Server Actions, server-side validation, static or dynamic pages rendered on the server.

### 📧 Email Infrastructure

- **Email system = hybrid**:
  - **Nodemailer (SMTP)**: for dev/testing and low-level fallback
  - **Resend (API)**: for production transactional emails
  - Wrap logic in an `EmailService` abstraction to switch contextually (env-aware)

### 📐 Architecture & Design Patterns

- **Structure**: Modular, feature-based — colocate logic, styles, components, and tests
- **API Layer**:
  - **tRPC** for full-stack TS apps
  - **REST** when needed for public APIs or third-party integration
  - **GraphQL** in federated or schema-complex setups
- **Error Handling**: Prefer Result<T, E> or domain-specific AppError types — no silent failures
- **State Management**:

  - Local or context state by default
  - Use **Zustand** for shared/global state
  - Redux only in edge cases requiring strict control

- **Hooks**: Business logic must be encapsulated into reusable custom hooks

### ⚙️ DX & Quality Standards

- Tools: ESLint, Prettier, Type-checker, and Vitest/Jest
- Commit standard: Conventional Commits (semantic versioning for packages)
- Tooling: Vite, Turborepo, Railway, Dokploy, etc. — prefer zero-config setups
- CI/CD: must include lint → type-check → test → build → deploy (if safe)

---

## 🔗 Model Context Protocol (MCP) Setup

We leverage **Model Context Protocol (MCP)** servers to provide secure, contextual access to structured data and tools by AI agents and LLMs.

### Neon MCP Server — PostgreSQL Management

- **Purpose**: Enables agents to manage Neon PostgreSQL projects (create schemas, run queries/migrations, branch management).
- **Usage**: Local and development environments only — used in tandem with LLMs and agents like Cursor, Claude Desktop, etc.
- **Security**: All destructive operations (DDL/DML) require confirmation. Production access is disabled unless explicitly reviewed.

### Bright Data MCP Server — Real-time Web Extraction

- **Purpose**: Gives LLMs and agents structured access to public web data (search, scrape, extract HTML/Markdown).
- **Usage**: Agents use this to pull content from Amazon, YouTube, LinkedIn, news, etc., bypassing blocks/bots where needed.
- **Security**: Target validation, rate-limiting, TOS compliance are mandatory. Avoid unauthorized scraping or TOS violations.

### Context7 MCP — Documentation & Knowledge Access

- **Purpose**: Centralized access to markdown/project documentation via Model Context Protocol.
- **Usage**: Enables AI agents to navigate, search, and understand internal doc files (`README.md`, `Context.md`, `*.guide.md`) across your codebase.
- **Setup**: Define clear metadata for file types and visibility. Support live doc updates via webhook or watch mode if possible.

---

### 🧠 Agent Best Practices with MCP

- Define available MCP servers in your AI agent configuration (`mcpServers: { neon: ..., brightdata: ..., context7: ... }`)
- Provide schema/tool metadata for each server to guide prompt generation
- Always log and confirm actions triggered by MCP agents (esp. if they modify data or state)
- If an MCP server is unavailable or fails validation, agents must **fallback** to conventional APIs or sandboxed mocks

---

## 🔐 Authentication (Better Auth)

### Overview

- **Better Auth** is the recommended authentication framework for TypeScript projects in this stack. It supports both **Prisma** and **Drizzle** as ORM adapters, enabling flexible, type-safe, and scalable auth flows.

### ORM Integration

- **Prisma**: Use the `prismaAdapter` from Better Auth for seamless integration. Make sure to generate the required schema using the Better Auth CLI and keep your Prisma schema in sync.
- **Drizzle**: Use the `drizzleAdapter` for Drizzle ORM. You can customize table names and schema mapping as needed. Always generate and apply migrations after schema changes.

#### Example: Prisma Adapter

```ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
});
```

#### Example: Drizzle Adapter

```ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./database";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
});
```

#### Schema Generation

- Use the Better Auth CLI to generate the required schema for your ORM:
  - For Prisma: `npx @better-auth/cli@latest generate --output prisma/schema.prisma`
  - For Drizzle: `npx @better-auth/cli@latest generate --output src/schema/auth.ts`
- Always apply migrations after schema changes (`npx prisma db push` for Prisma, `npx drizzle-kit migrate` for Drizzle).

### Best Practices

- **Environment Variables**: Store all secrets (JWT, OAuth, DB credentials) in `.env` and never commit them.
- **Schema Sync**: Regenerate and apply migrations whenever you update your auth config or upgrade Better Auth.
- **Custom Tables**: If you use custom table names, map them explicitly in the adapter config.
- **Plugins**: Leverage Better Auth plugins (e.g., Autumn, Polar, Dub Analytics) for advanced features like billing, analytics, and usage tracking.
- **API Security**: Always validate and sanitize user input, even when using Zod schemas.
- **Session Management**: Use secure cookies and set appropriate session expiration policies.
- **Testing**: Add integration tests for all critical auth flows (sign up, sign in, password reset, 2FA).
- **Documentation**: Document your auth strategy and any customizations in this file for team clarity.

---
