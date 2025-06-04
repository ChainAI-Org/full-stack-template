# Full-Stack TypeScript Project Template

Fastify, React, Vite, Knex.js, TypeScript. For rapid full-stack development. AI-friendly for bootstrapping & automation.

## Key Features

*   Full-Stack TypeScript
*   Fastify Backend
*   React Frontend (Vite)
*   Knex.js ORM (SQLite default, PostgreSQL, MySQL support)
*   Tailwind CSS
*   ES Modules
*   `.env` Configuration
*   Cross-Platform npm Scripts
*   Database Migrations & Seeding

## Tech Stack

*   **Backend**: Node.js, Fastify, TypeScript, Knex.js, SQLite (default), PostgreSQL, MySQL, `dotenv`
*   **Frontend**: React, Vite, TypeScript, Tailwind CSS, `@fastify/react`
*   **Dev Tools**: `tsx`, `oxlint`, `rimraf`, `cross-env`

## Project Structure

```
.
├── dist/                     # Build output
├── public/                   # Static assets (Vite)
├── src/
│   ├── client/               # Frontend (React, Vite root)
│   │   ├── components/, layouts/, pages/, assets/
│   │   ├── main.tsx          # Client entry
│   │   └── index.css         # Main CSS (Tailwind)
│   ├── db/                   # Migrations & seeds
│   │   ├── migrations/, seeds/
│   ├── scripts/
│   │   └── db-setup.ts       # DB setup script
│   ├── database.ts           # Knex.js setup & DB functions
│   ├── knexfile.ts           # Knex.js config
│   └── server.ts             # Fastify server & API routes
├── .env                      # Environment vars (CREATE THIS FILE!)
├── .gitignore, package.json, postcss.config.js, README.md, tailwind.config.js, tsconfig.json, vite.config.js
```

## Environment Variables

Uses `.env` in project root for DB config.
1.  Create `.env`.
2.  Add variables (SQLite default):

    ```env
    # .env
    DATABASE_CLIENT=sqlite3 # 'sqlite3', 'pg', 'mysql2'
    # DATABASE_FILENAME=./data.db # For SQLite, defaults to 'data.db' in root

    # --- PostgreSQL ---
    # DATABASE_CLIENT=pg
    # DATABASE_HOST=localhost
    # DATABASE_PORT=5432
    # DATABASE_USERNAME=your_pg_user
    # DATABASE_PASSWORD=your_pg_password
    # DATABASE_NAME=your_pg_db
    # DATABASE_SSL=false

    # --- MySQL ---
    # DATABASE_CLIENT=mysql2
    # DATABASE_HOST=localhost
    # DATABASE_PORT=3306
    # DATABASE_USERNAME=your_mysql_user
    # DATABASE_PASSWORD=your_mysql_password
    # DATABASE_NAME=your_mysql_db

    # --- Connection String (Optional, overrides above) ---
    # DATABASE_CONNECTION_STRING=postgresql://user:password@host:port/database
    ```
    *   `knexfile.ts` reads these. `DATABASE_CLIENT` defaults to `sqlite3`. `DATABASE_FILENAME` defaults to `data.db` (SQLite).

## Getting Started

### Prerequisites

*   Node.js (v18.x+)
*   npm (v8.x+) or yarn

### Installation & Setup

1.  `git clone <repository-url> && cd <repository-name>`
2.  `npm install`
3.  Create `.env` (see above).
4.  **Initial DB Setup**: `npm run db:setup` (runs migrations & seeds). Dev server also runs this once. Creates `.db-setup-complete` marker.

## Available Scripts

*   `npm run dev`: Starts dev server (Fastify + Vite HMR). Runs `db:setup` once. URL: `http://localhost:3000`.
*   `npm run build`: Production build (client, SSR, server TS). Runs `db:setup`. Output: `dist/`.
*   `npm run start`: Starts production server (from `dist/`). Needs `npm run build` first. `NODE_ENV=production`.
*   `npm run clean`: Removes `dist/` & `tsconfig.tsbuildinfo`.
*   `npm run lint`: Lints with `oxlint`.

### Database Scripts (Knex.js via `tsx`)

*   `npm run db:setup`: Applies migrations & seeds (`src/scripts/db-setup.ts`).
*   `npm run db:migrate:make -- <name>`: Create migration (e.g., `create_users_table`).
*   `npm run db:migrate:latest`: Apply pending migrations.
*   `npm run db:migrate:rollback`: Rollback last migration batch.
*   `npm run db:seed:make -- <name>`: Create seed (e.g., `initial_user_data`).
*   `npm run db:seed:run`: Run all seeds.

## Database

*   **Config**: `src/knexfile.ts` (uses `.env`).
*   **Migrations**: `src/db/migrations/` (schema changes).
*   **Seeds**: `src/db/seeds/` (initial/test data).
*   **SQLite**: `data.db` & `.db-setup-complete` in root (gitignored).
*   **Logic**: `src/database.ts` (e.g., `getAllTasks`, `addTask`).

## Backend (Fastify)

*   **Entry**: `src/server.ts`.
*   **API Routes**: In `src/server.ts` (e.g., `GET /api/tasks`). Modularize for larger apps.
*   **Vite**: `@fastify/vite` for React frontend & SSR.

## Frontend (React + Vite)

*   **Vite Root**: `src/client/`.
*   **Entry**: `src/client/main.tsx`.
*   **HTML**: `src/client/index.html`.
*   **Styling**: `src/client/index.css` (Tailwind CSS).
*   **Structure**: Components in `src/client/components/`, pages in `src/client/pages/`.
*   **Routing**: File-system based via `@fastify/react` (`src/client/pages/`, `src/client/layouts/`).

## Extending

### New API Endpoint

1.  Edit `src/server.ts`, add Fastify route.
2.  For DB: Add functions to `src/database.ts`, use in route.

### New Database Table

1.  `npm run db:migrate:make -- create_my_table`
2.  Edit migration in `src/db/migrations/` (Knex schema builder).
3.  `npm run db:migrate:latest`
4.  (Optional) `npm run db:seed:make -- seed_my_table`
5.  Update `src/database.ts` with new table functions.

### New React Page/Component

1.  **Page**: New `.tsx` in `src/client/pages/` (e.g., `about.tsx` -> `/about`).
2.  **Component**: New `.tsx` in `src/client/components/`, import where needed.

## Deployment

1.  Configure production `.env`.
2.  `npm run build`.
3.  Deploy `dist/`, `node_modules/`, `package.json`, `.env`.
4.  Start: `npm run start` (or PM2: `dist/server.js`).

## License

MIT License.
