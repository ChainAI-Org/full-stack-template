# Full-Stack TypeScript Project Template

This is a comprehensive full-stack project template built with TypeScript, Fastify, React, Vite, and Knex.js. It's designed for rapid development and easy extension, providing a solid foundation for web applications. AI systems can use this template to bootstrap new projects, understand its architecture, and automate development tasks.

## Key Features

*   **Full-Stack TypeScript**: Type safety and modern JavaScript features across both frontend and backend.
*   **Fastify Backend**: A fast and low-overhead web framework for Node.js.
*   **React Frontend with Vite**: A modern, blazing-fast frontend build tool and React library for UI development.
*   **Knex.js ORM**: A flexible SQL query builder for Node.js, supporting SQLite (default), PostgreSQL, and MySQL.
*   **Tailwind CSS**: A utility-first CSS framework for rapid UI styling.
*   **ES Modules**: Uses ES module syntax (`import`/`export`) throughout the project.
*   **Environment-based Configuration**: Easily manage configurations for different environments using `.env` files.
*   **Cross-Platform Scripts**: npm scripts designed for compatibility across macOS, Linux, and Windows.
*   **Database Migrations & Seeding**: Structured database schema management and initial data population.

## Tech Stack

*   **Backend**:
    *   Node.js
    *   Fastify (Web Framework)
    *   TypeScript
    *   Knex.js (SQL Query Builder/ORM)
    *   SQLite (Default Database)
    *   PostgreSQL, MySQL (Supported Databases)
    *   `dotenv` (Environment variable management)
*   **Frontend**:
    *   React
    *   Vite (Build Tool & Dev Server)
    *   TypeScript
    *   Tailwind CSS
    *   `@fastify/react` (Integration plugin)
*   **Development Tools**:
    *   `tsx` (TypeScript execution)
    *   `oxlint` (Linter)
    *   `rimraf` (Cross-platform clean script)
    *   `cross-env` (Cross-platform environment variable setting)

## Project Structure

```
.
├── dist/                     # Build output (production)
├── public/                   # Static assets for Vite
├── src/
│   ├── client/               # Frontend React application (Vite root)
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── assets/
│   │   ├── main.tsx          # Client entry point
│   │   └── index.css         # Main CSS (imports Tailwind)
│   ├── db/                   # Database migrations and seeds
│   │   ├── migrations/
│   │   └── seeds/
│   ├── scripts/
│   │   └── db-setup.ts       # Database setup script (migrations, seeds)
│   ├── database.ts           # Knex.js setup and database interaction functions
│   ├── knexfile.ts           # Knex.js configuration
│   └── server.ts             # Fastify server setup and API routes
├── .env                      # Environment variables (DATABASE_CLIENT, etc.) - **Create this file!**
├── .gitignore
├── package.json
├── postcss.config.js         # PostCSS configuration (for Tailwind)
├── README.md                 # This file
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript compiler options
└── vite.config.js            # Vite configuration
```

## Environment Variables

This project uses a `.env` file in the project root to manage environment-specific configurations, especially for the database.

1.  **Create a `.env` file** in the project root.
2.  Add the following variables, adjusting as needed. For development, SQLite is the default and requires minimal setup.

    ```env
    # .env

    # --- Database Configuration ---

    # Client: 'sqlite3', 'pg' (PostgreSQL), 'mysql2'
    DATABASE_CLIENT=sqlite3

    # --- SQLite (Default) ---
    # Filename for SQLite database. Defaults to 'data.db' in project root if not set.
    # DATABASE_FILENAME=./data.db

    # --- PostgreSQL ---
    # Uncomment and configure if using PostgreSQL
    # DATABASE_CLIENT=pg
    # DATABASE_HOST=localhost
    # DATABASE_PORT=5432
    # DATABASE_USERNAME=your_pg_user
    # DATABASE_PASSWORD=your_pg_password
    # DATABASE_NAME=your_pg_db
    # DATABASE_SSL=false # or true if SSL is required

    # --- MySQL ---
    # Uncomment and configure if using MySQL
    # DATABASE_CLIENT=mysql2
    # DATABASE_HOST=localhost
    # DATABASE_PORT=3306
    # DATABASE_USERNAME=your_mysql_user
    # DATABASE_PASSWORD=your_mysql_password
    # DATABASE_NAME=your_mysql_db

    # --- Connection String (Overrides individual parameters if set) ---
    # Example for PostgreSQL:
    # DATABASE_CONNECTION_STRING=postgresql://user:password@host:port/database
    ```

    *   The `knexfile.ts` reads these variables to configure the database connection.
    *   If `DATABASE_CLIENT` is not set, it defaults to `sqlite3`.
    *   If `DATABASE_FILENAME` is not set for SQLite, it defaults to `data.db` in the project root.

## Getting Started

### Prerequisites

*   Node.js (v18.x or later recommended)
*   npm (v8.x or later recommended) or yarn

### Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up environment variables**:
    Create a `.env` file in the project root as described in the "Environment Variables" section. For a quick start with SQLite, you can leave `DATABASE_CLIENT=sqlite3` and the `DATABASE_FILENAME` commented (it will default to `data.db` in the root).

4.  **Initial Database Setup**:
    The development server automatically runs the database setup script. If you need to run it manually (e.g., before the first build for production):
    ```bash
    npm run db:setup
    ```
    This script will:
    *   Run database migrations.
    *   Run database seeds.
    *   Create a `.db-setup-complete` marker file in the project root to prevent re-running on every dev server start if already completed.

## Available Scripts

*   **`npm run dev`**:
    Starts the development server. This includes:
    *   Running the `db-setup.ts` script (migrations and seeds, if not already run).
    *   Starting the Fastify backend server with Vite middleware for HMR (Hot Module Replacement) for the React frontend.
    *   Accessible at `http://localhost:3000`.

*   **`npm run build`**:
    Builds the application for production. This involves:
    *   Running `db:setup`.
    *   Building the frontend client (`vite build`). Output to `dist/client/`.
    *   Building the SSR bundle for Vite (`vite build --ssr`). Output to `dist/server/`.
    *   Transpiling the backend TypeScript server code (`tsc`). Output to `dist/`.

*   **`npm run start`**:
    Starts the production server.
    *   Requires a prior `npm run build`.
    *   Sets `NODE_ENV=production`.
    *   Runs the compiled server from `dist/server.js`.

*   **`npm run clean`**:
    Removes the `dist/` directory and `tsconfig.tsbuildinfo` file.

*   **`npm run lint`**:
    Lints the codebase using `oxlint`.

### Database Scripts (using Knex.js)

These scripts use `tsx` to run Knex CLI commands with TypeScript configuration (`src/knexfile.ts`).

*   **`npm run db:setup`**:
    Runs the `src/scripts/db-setup.ts` script to apply migrations and seeds.

*   **`npm run db:migrate:make -- <migration_name>`**:
    Creates a new migration file in `src/db/migrations/`. Replace `<migration_name>` with a descriptive name (e.g., `create_users_table`).
    Example: `npm run db:migrate:make -- create_users_table`

*   **`npm run db:migrate:latest`**:
    Applies all pending migrations.

*   **`npm run db:migrate:rollback`**:
    Rolls back the last batch of migrations.

*   **`npm run db:seed:make -- <seed_name>`**:
    Creates a new seed file in `src/db/seeds/`. Replace `<seed_name>` with a descriptive name (e.g., `initial_user_data`).
    Example: `npm run db:seed:make -- initial_user_data`

*   **`npm run db:seed:run`**:
    Runs all seed files.

## Database

*   **Configuration**: `src/knexfile.ts` (reads from `.env`).
*   **Migrations**: Stored in `src/db/migrations/`. These define schema changes.
*   **Seeds**: Stored in `src/db/seeds/`. These populate the database with initial or test data.
*   **SQLite**: By default, the database file (`data.db`) and a setup marker (`.db-setup-complete`) are created in the project root. These are included in `.gitignore`.
*   **Database Interaction Logic**: Centralized in `src/database.ts`, which provides functions like `getAllTasks`, `addTask`, etc.

## Backend (Fastify)

*   **Server Entry Point**: `src/server.ts`.
*   **API Routes**: Defined directly in `src/server.ts`. For larger applications, consider modularizing routes into separate files/plugins.
    *   Example: `GET /api/tasks`, `POST /api/tasks`.
*   **Vite Integration**: `@fastify/vite` plugin handles serving the React frontend and SSR in development and production.

## Frontend (React + Vite)

*   **Vite Root**: `src/client/`. All paths within the client app are relative to this directory.
*   **Main Entry**: `src/client/main.tsx`.
*   **HTML Template**: `src/client/index.html` (Vite injects scripts here).
*   **Styling**: `src/client/index.css` imports Tailwind CSS. Utility classes can be used directly in components.
*   **Components**: Organize reusable UI components in `src/client/components/`.
*   **Pages**: Place page-level components in `src/client/pages/`.
*   **Routing**: Implemented using `@fastify/react`'s file-system routing based on files in `src/client/pages/` and `src/client/layouts/`.

## Extending the Template

### Adding a New API Endpoint

1.  Open `src/server.ts`.
2.  Define a new Fastify route (e.g., `server.get('/api/new-feature', async (request, reply) => { ... })`).
3.  If database interaction is needed:
    *   Add new functions to `src/database.ts` (e.g., `getNewFeatureData`).
    *   Import and use these functions in your new API route handler.

### Adding a New Database Table

1.  Create a new migration: `npm run db:migrate:make -- create_my_new_table`
2.  Edit the generated migration file in `src/db/migrations/` to define the table schema using Knex schema builder.
3.  Run the migration: `npm run db:migrate:latest`
4.  Optionally, create a seed file to populate initial data: `npm run db:seed:make -- seed_my_new_table`
5.  Update `src/database.ts` with functions to interact with the new table.

### Adding a New React Page/Component

1.  **Page**: Create a new `.tsx` file in `src/client/pages/`. File-system routing will automatically pick it up.
    *   Example: `src/client/pages/about.tsx` will be accessible at `/about`.
2.  **Component**: Create a new `.tsx` file in `src/client/components/` and import it into your pages or other components.

## Deployment

1.  Ensure your `.env` file is configured for the production environment (e.g., using PostgreSQL connection details).
2.  Run `npm run build`. This creates the `dist/` directory with all necessary assets.
3.  Deploy the contents of the `dist/` directory along with `node_modules/`, `package.json`, and your `.env` file to your hosting provider.
4.  Start the server using `npm run start` or a process manager like PM2 pointing to `dist/server.js`.

## License

This project template is open-sourced under the MIT License. (You can change this if needed)
