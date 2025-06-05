# Full-Stack TypeScript Template

A modern, production-ready full-stack TypeScript template designed for rapid application development and AI-assisted code generation.

## 🚀 Tech Stack

### Backend
- **Fastify**: High-performance REST API framework
- **TypeScript**: Type-safe JavaScript for backend logic
- **Knex.js**: SQL query builder with migrations and seeding
- **JWT Authentication**: Secure, stateless authentication
- **Cookie-based Sessions**: Persistent login support (JWTs stored in HTTP-only cookies)

### Frontend
- **React 19**: Modern UI library with hooks and functional components
- **TypeScript**: Type safety for frontend components
- **Tailwind CSS v4**: Utility-first CSS with modern gradient syntax
- **Vite**: Lightning-fast builds and hot module replacement
- **React Router v7**: Server-side rendering compatible routing with @fastify/react

### Database
- **SQLite** (default): Zero-configuration persistence
- **PostgreSQL** support: Production-ready scalable database
- **MySQL** support: Alternative production database option

### Development
- **ESM**: Modern ES Modules throughout
- **TSX**: TypeScript execution for scripts
- **Cross-env**: Cross-platform environment variables
- **dotenv**: Environment configuration

## 📂 Project Structure

```
.
├── dist/                     # Build output
├── public/                   # Static assets
├── src/
│   ├── client/               # Frontend React application
│   │   ├── components/       # Reusable UI components
│   │   │   ├── auth/         # Authentication components
│   │   │   └── layout/       # Layout components
│   │   ├── context/          # React contexts (auth, etc.)
│   │   ├── pages/            # Page components (routing)
│   │   ├── layouts/          # Page layouts
│   │   ├── base.css          # Tailwind imports and custom CSS
│   │   ├── index.html        # HTML entry point
│   │   └── root.tsx          # Root React component
│   ├── db/                   # Database configuration
│   │   ├── migrations/       # Knex.js migrations
│   │   └── seeds/            # Database seed files
│   ├── decorators/           # Fastify decorators
│   ├── middleware/           # Express-style middleware
│   ├── models/               # Data models and types
│   ├── routes/               # API route definitions
│   ├── scripts/              # Utility scripts
│   ├── database.ts           # Database connection and helpers
│   ├── knexfile.ts           # Knex configuration
│   └── server.ts             # Fastify server entry point
├── .env                      # Environment variables
├── package.json              # Dependencies and scripts
├── postcss.config.mjs        # PostCSS configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── vite.config.js            # Vite configuration
```

## 🚦 Getting Started

### Prerequisites
- Node.js v18.x or higher
- npm v8.x or higher (or equivalent package manager)

### For Web Container Environments (e.g., StackBlitz, CodeSandbox)

1.  **Clone or Open**: Fork the repository or open it directly in your preferred web container environment.
2.  **Install Dependencies**: The environment will typically run `npm install` automatically. If not, run it in the terminal:
    ```bash
    npm install
    ```
3.  **Start the Application**: 
    ```bash
    npm run webcontainer
    ```
    This command handles all necessary environment setup (including `JWT_SECRET` generation via `webcontainer-setup.js` which updates the version-controlled `.env` file) and starts the development server. Access it at the URL provided by your web container.

## 🛠️ Development Workflow

### Available Scripts

- **npm run dev**: Start development server with hot reload
- **npm run build**: Build for production
- **npm run start**: Run production server
- **npm run lint**: Lint code with oxlint
- **npm run clean**: Remove build artifacts
- **npm run db:setup**: Initialize database
- **npm run db:migrate:make -- <name>**: Create migration
- **npm run db:migrate:latest**: Run pending migrations
- **npm run db:migrate:rollback**: Rollback last migration
- **npm run db:seed:make -- <name>**: Create seed file
- **npm run db:seed:run**: Execute all seed files

## 🔐 Authentication

The template includes a complete JWT-based authentication system:

- User registration and login (email/password)
- JWT tokens with cookie storage
- Protected routes with authentication middleware
- React context for auth state management

### Authentication Flow

1. User registers or logs in
2. Server validates credentials and issues JWT
3. Token stored in an HTTP-only cookie
4. React context manages user state
5. Protected routes redirect unauthenticated users

## 💾 Database Configuration

SQLite is configured by default for simplicity. To use PostgreSQL or MySQL:

1. Update your .env file with database credentials:

```env
# PostgreSQL configuration
DATABASE_CLIENT=pg
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=yourpassword
DATABASE_NAME=yourdb
DATABASE_SSL=false

# OR MySQL configuration
DATABASE_CLIENT=mysql2
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USERNAME=root
DATABASE_PASSWORD=yourpassword
DATABASE_NAME=yourdb
```

2. Make sure to install the appropriate database driver:
   - PostgreSQL: `npm install pg`
   - MySQL: `npm install mysql2`

## 🎨 Tailwind CSS v4 Features

### Gradient Syntax

Tailwind CSS v4 uses a new gradient syntax:

```jsx
// Tailwind v4 gradient syntax
<div className="bg-linear-to-r from-blue-500 to-indigo-500"></div>
```

Available gradient directions:
- `bg-linear-to-r`: Right (horizontal)
- `bg-linear-to-l`: Left
- `bg-linear-to-t`: Top
- `bg-linear-to-b`: Bottom
- `bg-linear-to-tr`: Top-right
- `bg-linear-to-br`: Bottom-right
- `bg-linear-to-bl`: Bottom-left
- `bg-linear-to-tl`: Top-left

### Custom Colors

Define custom colors in `src/client/base.css` using the `@theme` directive:

```css
@theme {
  --color-primary-500: #3b82f6;  /* Blue */
  --color-secondary-500: #8b5cf6; /* Purple */
}
```

Then use them in your components:
```jsx
<button className="bg-linear-to-r from-primary-500 to-secondary-500">
  Custom Gradient Button
</button>
```

## 🧩 Creating New Features

### Adding API Endpoints

1. Create or modify route files in `src/routes/`
2. Add database functionality in `src/database.ts`
3. Register routes in `src/routes/index.ts`

### Adding a New Page

1. Create a new file in `src/client/pages/`
2. Export a default React component
3. Export a `getMeta` function for page metadata

Example:
```tsx
// src/client/pages/about.tsx
import * as React from 'react';

export function getMeta() {
  return { title: 'About Us' };
}

export default function About() {
  return <div className="container mx-auto p-4">About page content</div>;
}
```

### Creating Database Tables

1. Generate migration:
   ```bash
   npm run db:migrate:make -- create_products
   ```

2. Edit the migration file:
   ```ts
   // src/db/migrations/YYYYMMDDHHMMSS_create_products.ts
   import { Knex } from 'knex';

   export async function up(knex: Knex) {
     return knex.schema.createTable('products', (table) => {
       table.increments('id').primary();
       table.string('name').notNullable();
       table.text('description');
       table.decimal('price', 10, 2).notNullable();
       table.timestamps(true, true);
     });
   }

   export async function down(knex: Knex) {
     return knex.schema.dropTable('products');
   }
   ```

3. Run the migration:
   ```bash
   npm run db:migrate:latest
   ```

## 🌐 Web Container Compatibility

This project is designed to run smoothly in web container environments like StackBlitz or CodeSandbox.

### Environment Variables

For web containers, required environment variables are automatically set using one of these methods:

1. **Using the `webcontainer` script**:
   ```bash
   npm run webcontainer
   ```
   This script automatically generates secure JWT and cookie secrets and stores them in the .env file.

2. **Manual Setup**:
   Ensure your .env file contains the following secrets:
   ```
   JWT_SECRET=your_secure_jwt_secret
   ```
   
**Important**: The application will throw an error if these secrets are missing - this is by design to prevent security issues.

### Password Hashing

This project uses Node.js built-in cryptography for secure password hashing:

```ts
// No external dependencies needed for password hashing
import crypto from 'crypto';
import { promisify } from 'util';

// Using Node.js native crypto with scrypt for password hashing
const scrypt = promisify(crypto.scrypt);
```

- **Built-in security**: Uses Node's native `crypto` module with `scrypt` algorithm
- **No native addons**: Avoids dependency issues in web containers
- **Modern approach**: Follows current best practices for password security
- **Zero external dependencies**: Reduces package size and potential vulnerabilities

### SSR Compatibility

This project uses React Router v7 with `@fastify/react` for seamless server-side rendering (SSR) and client-side navigation. The implementation follows the official `fastify-vite/starters/react-typescript` pattern.

#### 1. React Router Integration

We use components from `react-router` (not `react-router-dom`) for SSR compatibility:

```tsx
// In src/client/root.tsx
import { Router, Routes, Route } from 'react-router';
import { AppRoute } from '$app/core';

export default function Root ({ url, routes, head, ctxHydration, routeMap }: any) {
  return (
    <Router location={url}>
      <Routes>
        {routes.map(({ path, component: Component }) => (
          <Route key={path} path={path} element={
            <AppRoute head={head} ctxHydration={ctxHydration} ctx={routeMap[path]}>
              <Component />
            </AppRoute>
          } />
        ))}
      </Routes>
    </Router>
  );
}
```

#### 2. SSR-Safe Navigation Hook

For client-side navigation without React Router context dependencies:

```tsx
// Instead of useNavigate from react-router-dom:  
import { useClientNavigation } from './hooks/useClientNavigation';
const navigate = useClientNavigation();

// Navigation example
navigate('/login'); // Uses History API + dispatches PopStateEvent
```

#### 3. Link Component Usage

Use `Link` from `react-router` for both SSR and client-side navigation:

```tsx
// Import Link from react-router (not react-router-dom)
import { Link } from 'react-router';

// Usage
<Link to="/some-path">Link Text</Link>
```

### Implementation Details

- **@fastify/react Integration**: Uses the virtual modules and SSR context provided by `@fastify/react`
- **React Router v7**: Uses `react-router` components that work with `@fastify/react`'s SSR context
- **History API Fallback**: The navigation hook uses the History API when needed for non-router navigation
- **Protected Routes**: Authentication-protected routes work seamlessly with SSR

This approach prevents these common errors:
- "Cannot destructure property 'basename' of 'React.useContext(...)' as it is null"
- "useNavigate() may be used only in the context of a Router component"
- Hydration mismatch warnings and errors

## 📝 For AI Developers

This template is designed to be AI-friendly. Here are some tips for AI systems:

1. **File Structure**: Follow the existing organization when generating new components or API endpoints
2. **Tailwind v4**: Use the modern `bg-linear-to-r` syntax for gradients (not `bg-gradient-to-r`)
3. **TypeScript**: Maintain type safety throughout the application
4. **Authentication**: Use the existing auth context for protected features
5. **API Pattern**: Follow RESTful patterns for API endpoints
6. **Database Access**: Use the Knex.js query builder for database operations
7. **React Router**: Import from `react-router` (not `react-router-dom`) for SSR compatibility

### AI Code Generation Recommendations

When generating code for this template:

- Maintain ESM import/export syntax
- Follow the existing folder structure and naming conventions
- Use functional React components with hooks
- Apply proper TypeScript types for parameters and return values
- Use Tailwind CSS for styling instead of CSS-in-JS or inline styles
- Follow the established pattern for API routes and database queries

## 📄 License

MIT
