# Full-Stack TypeScript Template

AI-ready template for rapid full-stack TypeScript application development.

## Tech Stack

-   **Backend**: Fastify, TypeScript, Knex.js, JWT Auth (HTTP-only Cookies)
-   **Frontend**: React 19, TypeScript, Tailwind CSS v4, Vite, React Router v7 (SSR)
-   **Database**: SQLite (default), PostgreSQL, MySQL support
-   **Development**: ESM, TSX, Cross-env, dotenv

## Project Structure

```
.
├── dist/                     # Build output
├── public/                   # Static assets
├── src/
│   ├── client/               # Frontend React application
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # React contexts
│   │   ├── pages/            # Page components (routing)
│   │   ├── layouts/          # Page layouts
│   │   ├── hooks/            # Custom React hooks
│   │   ├── base.css          # Tailwind imports
│   │   ├── index.html        # HTML entry point
│   │   └── root.tsx          # Root React component (SSR entry)
│   ├── db/                   # Migrations & seeds
│   ├── models/               # Data models/types
│   ├── routes/               # API route definitions
│   ├── scripts/              # Utility scripts (e.g., db-setup.ts)
│   ├── database.ts           # DB connection setup
│   ├── knexfile.ts           # Knex configuration
│   └── server.ts             # Fastify server entry point
├── .env                      # Environment variables (version-controlled base)
├── package.json
├── postcss.config.mjs
├── tailwind.config.js
├── tsconfig.json
└── vite.config.js
```

## Getting Started

### Prerequisites

-   Node.js >=18.x
-   npm >=8.x

### Web Container Environments (Recommended for Quick Start)

1.  Open/Fork repository in web container (e.g., StackBlitz, CodeSandbox).
2.  `npm install` (usually automatic).
3.  `npm run webcontainer` (handles `.env` setup via `webcontainer-setup.js` & starts server).

### Local Development Setup

1.  Clone repository.
2.  `npm install`.
3.  Configure `.env` (present in repo):
    -   **Update `JWT_SECRET`** with a strong, unique random string.
    -   Set `DATABASE_CLIENT` (e.g., `sqlite3`, `pg`, `mysql2`) and connection details if not using default SQLite.
4.  `npm run db:setup` (runs migrations & seeds).
5.  `npm run dev`.

## Development Workflow

### Key Scripts

-   `npm run dev`: Start dev server.
-   `npm run build`: Production build.
-   `npm run start`: Production server.
-   `npm run lint`: Lint code.
-   `npm run db:setup`: Initialize/reset database.
-   `npm run db:migrate:make -- <name>`: Create migration.
-   `npm run db:migrate:latest`: Run migrations.
-   `npm run db:seed:make -- <name>`: Create seed.
-   `npm run db:seed:run`: Run seeds.

### Database-Agnostic Queries

-   **Core Principle**: Strive to write SQL queries that are as portable as possible across different database systems (SQLite, PostgreSQL, MySQL). This ensures flexibility and reduces vendor lock-in.

-   **Common Pitfall: `RETURNING` or Output Clauses**:
    -   Databases like PostgreSQL offer a `RETURNING` clause to get data back from `INSERT`, `UPDATE`, or `DELETE` statements in a single query. Other databases (like MySQL or standard SQLite) do not support this or have different syntax (e.g., `OUTPUT` in SQL Server).
    -   **Recommended Pattern**: For operations needing the affected record's data (especially auto-generated IDs or updated values), perform the primary operation first, then follow with a separate `SELECT` query.
        ```typescript
        // Example: Insert then Fetch (Portable)
        await db('users').insert(userData);
        const newUser = await db('users').where({ email: userData.email }).first();
        // newUser now contains the full record, including any auto-generated ID.

        // Example: Update then Fetch (Portable)
        await db('tasks').where({ id: taskId }).update({ completed: true });
        const updatedTask = await db('tasks').where({ id: taskId }).first();
        ```

-   **Other Areas for Caution (General Checklist)**:
    -   **Date/Time**: Use `knex.fn.now()` for DB timestamps; prefer UTC; handle complex date logic in-app.
    -   **JSON/JSONB**: Use Knex helpers for simple queries; process complex JSON in-app.
    -   **Strings**: `LIKE` is portable; complex manipulations (concat, regex) are best in-app.
    -   **Auto-increment**: Rely on Knex schema builder (`table.increments()`) and insert-then-fetch.
    -   **Case Sensitivity**: Use consistent naming (e.g., `snake_case`); use `LOWER()` for comparisons cautiously.
    -   **`NULL` Handling**: Use `IS NULL`/`IS NOT NULL` (or Knex's `.whereNull()`/`.whereNotNull()`).
    -   **Pagination**: Always use Knex's `.limit()` and `.offset()`.
    -   **Data Types**: Be mindful of how Knex types map to native DB types.

-   **Leverage Knex.js Abstractions**: Knex.js is designed to smooth over many of these differences. Prefer using its query builder methods, as they often translate to the correct syntax for the configured database client.

-   **Test Across Databases**: If your application *must* support multiple databases and involves complex queries, test thoroughly against each target system.

### Webcontainer-Friendly Packages

-   **Principle**: Strictly avoid native Node.js modules. Prefer pure JS or WASM-compatible packages.
-   **Check**: Package documentation for browser/webcontainer compatibility.
-   **Internal Example**: `webcontainer-setup.js` uses Node.js `crypto` for one-time secret generation; `@fastify/cookie` is used without a secret to avoid native crypto dependencies at runtime.

## Core Features & Configuration

### Authentication

-   JWT-based (email/password).
-   Tokens stored in HTTP-only cookies.
-   Protected API routes via `src/middleware/auth.ts`.
-   Client-side auth state via `src/client/context/AuthContext.tsx`.

### Database Configuration

-   Default: SQLite (`DATABASE_CLIENT=sqlite3` in `.env`).
-   To use PostgreSQL/MySQL:
    1.  Update `.env`: `DATABASE_CLIENT`, `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `DATABASE_NAME`.
    2.  Install driver: `npm install pg` or `npm install mysql2`.

### Tailwind CSS v4

-   Config: `tailwind.config.js`, `postcss.config.mjs`.
-   Base styles & custom properties: `src/client/base.css` (uses `@theme`).

### Adding API Endpoints

1.  Define logic in `src/routes/` (e.g., `src/routes/user.routes.ts`).
2.  Register in `src/routes/index.ts`.

### Adding Pages (React)

1.  Create component in `src/client/pages/` (e.g., `MyPage.tsx`).
2.  Export `default` component and optional `getServerSideProps` / `getMeta`.
3.  Routes are automatically detected from this directory by `server.ts`.

## Server-Side Rendering (SSR) & Routing

-   **Framework**: `@fastify/react` with Vite.
-   **SSR Entry**: `src/client/root.tsx`.
-   **Server Data**: `getServerSideProps` in page components.
-   **Head Management**: `@unhead/react` via `<AppRoute>` (`src/client/components/layout/AppRoute.tsx`).

## `webcontainer-setup.js`

-   **Purpose**: Ensures `JWT_SECRET` exists in `.env` for web container environments, generating one if absent.
-   **Trigger**: Runs via `npm run webcontainer`.

## Contributing

Open an issue or pull request for contributions.

## License

MIT Licensed.
