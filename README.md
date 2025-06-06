# Full-Stack TypeScript Template

AI-ready template for rapid full-stack TypeScript application development. Created using Moxby (https://moxby.com).

## Common Issues & Key Reminders

To ensure smooth development and avoid common pitfalls with this template, please keep the following in mind:

*   **API Synchronization**: Always update frontend API calls (typically in `src/client/pages/` components or `src/client/fetch.ts`) after modifying backend API routes (`src/routes/`). (See details under "Adding API Endpoints")
*   **ESM Import Paths (Backend)**: Remember to use full relative paths with `.js` extensions for JavaScript module imports in the backend (e.g., `import utils from './utils.js';`).
*   **Database Migrations & Seeds**:
    *   **Migration Naming & Order**: To ensure explicit and clear control over the execution sequence, this project uses **numerical prefixes** for migration filenames (e.g., `001_create_users.js`, `002_add_email_to_users.js`, `003_create_posts_table.js`) and you must do the same. Knex runs migrations in lexicographical (alphabetical/numerical) order based on these filenames.
    *   When creating a new migration (e.g., `npm run db:migrate:make -- <name>`), you **must then edit the newly generated file** in `src/db/migrations/` to define your schema changes (e.g., creating tables, adding columns) using Knex.js syntax.
    *   After defining the changes in the migration file, run `npm run db:migrate:latest` to apply them.
    *   Similarly, after creating new seed files (e.g., `npm run db:seed:make -- <name>`), populate them with data and then run `npm run db:seed:run`. (Refer to "Key Scripts" for more details on commands).
*   **Frontend Routing & Layouts**: Pages in `src/client/pages/` are auto-routed. Layouts are applied via `src/client/layouts/` and the `AppRoute` component.
*   **TypeScript Type Imports**: Use `import type { MyType } from './myModule';` for type-only imports to ensure correct module handling.
*   **Import/Export Matching**: Ensure your import style (e.g., `import { item } from './module'` for named exports, or `import item from './module'` for default exports) correctly matches how the item is exported from its source module.
*   **Routing Package**: This project uses React Router v7 integrated via `@fastify/react` for SSR. Do **not** install or use `react-router-dom`; rely on the existing routing setup and page structure in `src/client/pages/`.
*   **Focused Feature Development**: To ensure thoroughness and integration, aim to complete one feature (including both backend and frontend aspects) entirely before moving on to the next. This helps prevent context switching and ensures all parts of a feature are working together. See "Example End-to-End Feature Workflow" under "Development Workflow" for a detailed illustration.
*   **Architectural Bedrock (Generally, do not modify these files)**: 
    *   `vite.config.js`
    *   `postcss.config.mjs`
    *   `src/server.ts`
    *   `src/client/root.tsx` (The entry point for the React application and core SSR hydration logic.)
    *   `src/client/index.html`
        *   `src/client/context.ts` (The SSR page context mechanism.)`
        *   `src/knexfile.ts`
        *   `src/database.ts`
        *   `src/client/context/AuthContext.tsx` (Extending functionality is fine; altering the core token/user management logic requires care.)
        *   `src/client/context/ThemeContext.tsx` (Extending functionality is fine; altering core theme switching requires care.)

## Tech Stack

-   **Backend**: Fastify, TypeScript, Knex.js, JWT Auth (HTTP-only Cookies)
-   **Frontend**: React 19, TypeScript, Tailwind CSS v4, Vite, React Router v7 (SSR)
-   **Database**: SQLite (default), PostgreSQL, MySQL support
-   **Development**: ESM, TSX, Cross-env, dotenv

## Project Structure

```
.
├── dist/                     # Build output
├── public/                   # Static assets (served by Fastify)
├── src/
│   ├── client/               # Frontend React application (Vite)
│   │   ├── assets/           # Static client-side assets (e.g., images)
│   │   │   └── logo.svg      # Application logo
│   │   ├── components/       # Reusable UI components
│   │   │   ├── auth/         # Authentication-specific components
│   │   │   │   ├── Login.tsx
│   │   │   │   ├── ProtectedRoute.tsx
│   │   │   │   └── Signup.tsx
│   │   │   ├── common/       # Core, general-purpose components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   └── Modal.tsx
│   │   │   └── layout/       # Components used within main layouts (e.g., Header)
│   │   │       └── Header.tsx
│   │   ├── context/          # React contexts
│   │   │   ├── AuthContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── hooks/            # Custom React hooks (currently empty)
│   │   ├── layouts/          # Main page layout structures (used by SSR)
│   │   │   ├── auth.jsx      # Layout for authentication pages
│   │   │   └── default.jsx   # Default layout for other pages
│   │   ├── lib/              # Utility functions, helpers specific to client
│   │   │   └── utils.ts
│   │   ├── pages/            # Page components (auto-routed by SSR)
│   │   │   ├── index.tsx     # Home page (/)
│   │   │   ├── login.tsx     # Login page (/login)
│   │   │   ├── signup.tsx    # Signup page (/signup)
│   │   │   └── tasks.tsx     # Tasks page (/tasks)
│   │   ├── base.css          # Tailwind base styles, custom properties, @theme
│   │   ├── context.ts        # SSR page context provider
│   │   ├── fetch.ts          # Client-side API fetch utility
│   │   ├── index.html        # Vite HTML entry point
│   │   ├── root.tsx          # Client root component (hydrates SSR)
│   │   └── tsconfig.json     # TypeScript config for client-side code
│   ├── db/                   # Database migrations & seeds
│   ├── models/               # Data models/types (e.g., Task interface)
│   ├── routes/               # Backend API route definitions (Fastify plugins)
│   ├── scripts/              # Utility scripts (e.g., db-setup.ts)
│   ├── database.ts           # Knex database connection setup
│   ├── knexfile.ts           # Knex configuration for migrations/seeds
│   └── server.ts             # Fastify server entry point & SSR handler
├── .env                      # Environment variables (version-controlled base)
├── package.json
├── postcss.config.mjs        # PostCSS configuration (for Tailwind)
├── tailwind.config.js        # Tailwind CSS v4 configuration
├── tsconfig.json             # Root TypeScript configuration (for backend)
└── vite.config.js            # Vite configuration for client-side bundling
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
-   **Running the Development Server (`npm run dev`)**: To maximize focused development time, it's recommended to run `npm run dev` only when a significant set of planned features (or all features for a given development cycle) are substantially implemented on both backend and frontend. This approach is generally more efficient than running the server continuously, reserving its use for comprehensive integration testing and UI/UX refinement phases after major coding efforts are complete.

### Example End-to-End Feature Workflow: Building '[Feature Name]'

This workflow outlines how you should approach building a new, self-contained feature (e.g., 'Task Management', 'User Authentication', 'Product Catalog Display') from backend to frontend. You should aim to complete all development and refactoring for one such core feature.

1.  **Define Requirements**:
    *   **Goal**: Clearly articulate what the feature `[Feature Name]` should achieve based on USER input.
    *   **Data**: Identify necessary data models, fields, and relationships for `[Feature Name]`.
    *   **Scope**: Define what is included and explicitly what is out of scope for this iteration of `[Feature Name]`.


2.  **Backend Implementation**:
    *   **Database (Migrations)**:
        *   Based on requirements, identify necessary schema changes (new tables, columns, modifications for `[Feature Name]`)
        *   Generate migration file(s) using the project's script (e.g., `npm run db:migrate:make -- <migration_name_for_feature>`).
        *   **Crucial**: Populate the newly generated migration file(s) in `src/db/migrations/` with the correct Knex.js code to implement the schema changes.
    *   **API Endpoints (`src/routes/`)**:
        *   Design and define necessary API endpoints for `[Feature Name]` (e.g., `GET /api/[feature_slug]`, `POST /api/[feature_slug]`, `PUT /api/[feature_slug]/:id`).
        *   Implement route handlers in a new or existing route file (e.g., `src/routes/[feature_slug].routes.ts`).
        *   Ensure handlers include input validation, appropriate authentication/authorization checks (leveraging existing mechanisms like `AuthContext` if applicable), and calls to data model functions.
    *   **Data Model/Logic (`src/models/`)**:
        *   Implement functions in new or existing model files (e.g., `src/models/[feature_name].model.ts`) to handle data persistence and business logic related to `[Feature Name]` (e.g., CRUD operations, data transformations, complex queries).
    *   **Register Routes**: Ensure any new API routes are correctly registered in the main router setup (e.g., in `src/routes/index.ts`).
    *   **Internal API Design Verification**: You should internally verify (e.g., through code analysis or logical review) that the implemented API endpoints, request/response structures, and data models align with the defined requirements for `[Feature Name]`.

3.  **Frontend Implementation (`src/client/`)**:
    *   **Page(s) & Components (`src/client/pages/`, `src/client/components/`)**:
        *   Create necessary React page components for `[Feature Name]` (e.g., `src/client/pages/[feature_slug]/index.tsx`, `src/client/pages/[feature_slug]/[id].tsx`) and any reusable sub-components under `src/client/components/`.
        *   Pages should handle data fetching from the new backend APIs, display information, and manage user interactions related to `[Feature Name]`.
        *   Utilize existing common components (e.g., `Button.tsx`, `Input.tsx`) where appropriate to maintain UI consistency.
    *   **API Call Functions (e.g., in `src/client/fetch.ts` or within page components)**:
        *   Implement typed functions to interact with the newly created backend API endpoints for `[Feature Name]`.
        *   Manage loading states, handle API responses (both success and error cases), and provide appropriate user feedback.
    *   **State Management (e.g., `useState`, `useContext`, or other established project patterns)**:
        *   Manage component-level and/or global application state as required for the functionality of `[Feature Name]`.
    *   **Navigation & Routing**:
        *   Integrate new pages or views for `[Feature Name]` into the application's navigation structure (e.g., adding links in `Header.tsx`, sidebars, or other relevant UI components).
        *   Ensure client-side routing for `[Feature Name]` works correctly.
    *   **Styling**: Apply Tailwind CSS to ensure new UI elements for `[Feature Name]` are consistent with the application's established design language and theme (light/dark modes).

4.  **Review & Refactor (Self-Correction & USER Feedback Incorporation)**:
    *   Review all new backend and frontend code written for `[Feature Name]` for:
        *   Clarity, readability, and maintainability.
        *   Efficiency and potential performance considerations.
        *   Adherence to security best practices (e.g., input sanitization on backend, proper handling of sensitive data on frontend).
        *   Consistency with project conventions and the guidelines in this README.
        *   Robust error handling and clear user feedback mechanisms.
    *   If the USER provides feedback during the development of `[Feature Name]`, you should incorporate these changes.
    *   Ensure all parts of the implemented `[Feature Name]` are well-integrated and function cohesively.

Your primary development role for `[Feature Name]` concludes after this 'Review & Refactor' stage. You should move on to the next feature.

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
3.  **Important**: If you modify or add backend API routes, ensure corresponding frontend API calls (typically in `src/client/pages/` components or `src/client/fetch.ts`) are updated to match the new endpoints, request/response structures, and HTTP methods.

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
