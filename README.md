# Full-Stack TypeScript Template

AI-ready template for rapid full-stack TypeScript application development. Created using Moxby (https://moxby.com).

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

**Note on Development:**
-   If you add **new migration files**, run `npm run db:migrate:latest`.
-   If you add **new seed files** run `npm run db:seed:run`.

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

-  **Seeding**: Abpve instructions apply to seeding as well. Use Knex.js for all database interactions in seeds.

### Webcontainer-Friendly Packages

-   **Principle**: Strictly avoid native Node.js modules. Prefer pure JS or WASM-compatible packages.
-   **Check**: Package documentation for browser/webcontainer compatibility.
-   **Internal Example**: used bycryptjs instead of bcrypt because bcrypt is native Node.js module


### Code Organization Principles

-   **Modularity**: Break down features and components into smaller, focused files.
    -   **Benefits**: Improves readability, maintainability, and testability. Makes it easier for multiple developers (and AI agents) to work on different parts of the codebase concurrently.
    -   **Example**: For backend logic, within a file like `src/routes/user.routes.ts`, a route handler for creating a user should be concise. It might call a dedicated function from a service or action file, for example, `src/services/user/createUserHandler.ts` or `src/actions/user/processUserCreation.ts`. This keeps route files focused on routing and request/response marshalling, while the dedicated files handle specific business logic. For UI, a complex page component, perhaps `src/client/pages/UserProfilePage.tsx` (if you adopt a `pages` directory structure under `src/client/`), would be better composed of smaller, focused components from `src/client/components/user/` like `ProfileHeader.tsx` and `ActivityFeed.tsx`, each in their own file.
-   **Single Responsibility Principle (SRP)**: Each file or module should ideally have one primary responsibility.
-   **Clear Naming**: Use descriptive names for files and directories that clearly indicate their purpose or the feature they relate to.

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

### Best Practices for AI-Driven Development

To facilitate the creation of robust and bug-free features using this template, you should adhere to the following core TypeScript and Node.js ESM development principles:

1.  **Strict Type Safety & Adherence:**
    *   **Principle:** Leverage TypeScript's static typing to its fullest. Avoid `any` where possible; prefer specific types or `unknown` with type guards.
    *   **Action:** Consistently define and use clear interfaces and types for all data structures, function signatures, and component props.

2.  **ESM Module Integrity:**
    *   **Principle:** Ensure correct ECMAScript Module (ESM) syntax and resolution.
    *   **Action:**
        *   Clearly distinguish between value and type imports/exports: use `export type` and `import type` for type-only constructs.
        *   **Always include the `.js` file extension** in relative import paths (e.g., `from './myModule.js'`) as required by Node.js ESM.
        *   Verify that all imported entities are explicitly exported from their source modules. To prevent "does not provide an export named '...'" errors:
            *   Double-check that the function, class, variable, or type is actually exported from the source file (`export { itemName }` or `export default itemName`).
            *   Ensure the exported name exactly matches the imported name (case-sensitive).
            *   If using TypeScript, confirm that the compilation process (`tsc`) is correctly generating the JavaScript output file (`.js`) with the intended exports. Check the `dist` folder or relevant output directory.

3.  **Configuration Accuracy (`tsconfig.json`, etc.):**
    *   **Principle:** Project compilation and runtime behavior are critically dependent on correct configuration.
    *   **Action:** Ensure `tsconfig.json` settings (especially `module`, `moduleResolution`, `target`, `strict`) are appropriate for an ESM Node.js environment. Be mindful of other project configurations (e.g., ESLint, Prettier).

4.  **Robust Asynchronous Operations:**
    *   **Principle:** Properly manage all asynchronous operations to prevent unhandled promise rejections and ensure predictable control flow.
    *   **Action:** Consistently use `async/await` for promise-based operations and include comprehensive `try/catch` blocks or `.catch()` handlers for error management.

5.  **Code Modularity and Single Responsibility:**
    *   **Guidance:** Strictly follow the "Code Organization Principles" (detailed earlier) to ensure modularity and single responsibility in all generated code.

6.  **API and Dependency Contract Adherence:**
    *   **Principle:** External libraries and internal modules have defined APIs (contracts).
    *   **Action:** When using dependencies or calling other modules, strictly adhere to their documented API signatures and expected data types.

7.  **Dependency Management Diligence:**
    *   **Principle:** Ensure all external packages are explicitly declared in `package.json` before use.
    *   **Action:** Before importing or using an external package, verify its presence in `package.json`. If missing, add it using the appropriate npm/yarn/pnpm command (e.g., `npm install <package-name> --save` or `npm install <package-name> --save-dev`) and ensure the `package.json` and any lock files are updated.

8.  **Standardized API Error Responses:**
    *   **Principle:** API errors must be communicated clearly, consistently, and securely.
    *   **Action:**
        *   Utilize appropriate HTTP status codes (e.g., 400 for client errors, 500 for server errors).
        *   Return error details in a structured format (e.g., JSON with `error` and `message` fields: `{"error": "Validation Error", "message": "Email is required."}`).
        *   Avoid exposing sensitive information in error responses. Stack traces may be included in development/non-production environments for debugging purposes but MUST be suppressed in production environments.
        *   Ensure a consistent error response structure across all API endpoints.

9.  **Database Integrity and Foreign Key Handling:**
    *   **Principle:** Maintain data integrity by respecting all database constraints, especially foreign key relationships.
    *   **Action:**
        *   When inserting or updating records with foreign key columns, ensure the referenced record in the parent table exists. If it might not, query for it first or handle potential database errors gracefully.
        *   For nullable foreign keys, explicitly pass `null` if no association is intended, rather than relying on default database behavior if unsure.
        *   Be aware of cascading operations (e.g., `ON DELETE CASCADE`) defined in migrations and their implications.
        *   When generating seed data, ensure the order of insertion respects dependencies (e.g., create users before creating tasks that reference those users).

10. **Idempotent Database Migrations:**
    *   **Principle:** Database migrations should be written in a way that they can be run multiple times without causing errors or unintended side effects. This is crucial for environments where migrations might be re-run or applied to databases in varying states.
    *   **Action:**
        *   Before attempting to create a table, check if it already exists (e.g., `if (!(await knex.schema.hasTable('tableName'))) { ... }`).
        *   Before adding a column to a table, check if the column already exists (e.g., `if (!(await knex.schema.hasColumn('tableName', 'columnName'))) { ... }`).
        *   Similarly, check for the existence of indexes, foreign key constraints, or other schema elements before attempting to create them.
        *   In the `down` function of a migration, perform corresponding checks before attempting to drop elements (e.g., drop column only if it exists).

By consistently applying these principles, AI-generated code will be more reliable, easier to debug, and better aligned with the project's architecture.

## Server-Side Rendering (SSR) & Routing

-   **Framework**: `@fastify/react` with Vite.
-   **SSR Entry**: `src/client/root.tsx`.
-   **Server Data**: `getServerSideProps` in page components.
-   **Head Management**: `@unhead/react` via `<AppRoute>` (`src/client/components/layout/AppRoute.tsx`).

## `webcontainer-setup.js`

-   **Purpose**: Ensures `JWT_SECRET` exists in `.env` for web container environments, generating one if absent.
-   **Trigger**: Runs via `npm run webcontainer`.
