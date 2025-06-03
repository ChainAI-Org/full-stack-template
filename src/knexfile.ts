import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Recreate __dirname and __filename for ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import type { Knex } from 'knex';
import dotenv from 'dotenv';

// Load environment variables from .env file if present
dotenv.config();

const BASE_PATH = path.join(__dirname, 'db'); // Base path for migrations, seeds, and default SQLite file

const client: string = process.env.DATABASE_CLIENT || 'sqlite3';
let connection: Knex.Config['connection'];

// Prioritize DB_CONNECTION_STRING if available
if (process.env.DATABASE_CONNECTION_STRING) {
  connection = process.env.DATABASE_CONNECTION_STRING;
  // For SQLite, if DB_CONNECTION_STRING is used, it's the filename.
  // We need to ensure it's an absolute path or relative to project root if not already.
  // However, Knex handles relative paths for SQLite filenames well, often resolving them from the knexfile's directory.
  // If issues arise, ensure DB_CONNECTION_STRING for SQLite is an absolute path or adjust here.
} else {
  // Fallback to individual parameters
  switch (client) {
    case 'pg':
      const pgUser = process.env.DATABASE_USERNAME;
      const pgPassword = process.env.DATABASE_PASSWORD;
      const pgDatabase = process.env.DATABASE_NAME;

      if (pgUser === undefined || pgPassword === undefined || pgDatabase === undefined) {
        throw new Error('For PostgreSQL (pg), DATABASE_USERNAME, DATABASE_PASSWORD, and DATABASE_NAME environment variables must be set when not using DATABASE_CONNECTION_STRING.');
      }
      const pgConnectionDetails = {
        host: process.env.DATABASE_HOST || '127.0.0.1',
        port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 5432,
        user: pgUser,
        password: pgPassword,
        database: pgDatabase,
        ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined
      } as Knex.PgConnectionConfig; // Type assertion here
      connection = pgConnectionDetails;
      break;
    case 'mysql':
    case 'mysql2': // mysql2 is often preferred
      const mysqlUser = process.env.DATABASE_USERNAME;
      const mysqlPassword = process.env.DATABASE_PASSWORD;
      const mysqlDatabase = process.env.DATABASE_NAME;

      if (mysqlUser === undefined || mysqlPassword === undefined || mysqlDatabase === undefined) {
        throw new Error('For MySQL (mysql/mysql2), DATABASE_USERNAME, DATABASE_PASSWORD, and DATABASE_NAME environment variables must be set when not using DATABASE_CONNECTION_STRING.');
      }
      const mysqlConnectionDetails = {
        host: process.env.DATABASE_HOST || '127.0.0.1',
        port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 3306,
        user: mysqlUser,
        password: mysqlPassword,
        database: mysqlDatabase,
      } as Knex.MySqlConnectionConfig; // Type assertion here
      connection = mysqlConnectionDetails;
      break;
    case 'sqlite3':
    default: // Default to SQLite if DB_CLIENT is not set or unrecognized
      const sqliteConnectionDetails = {
        filename: process.env.DATABASE_FILENAME || path.join(__dirname, '..', 'data.db'), // Defaults to project_root/data.db
      } as Knex.Sqlite3ConnectionConfig; // Type assertion here
      connection = sqliteConnectionDetails;
      break;
  }
}

const config: Knex.Config = {
  client: client,
  connection: connection,
  useNullAsDefault: client === 'sqlite3',
  migrations: {
    directory: path.join(BASE_PATH, 'migrations'),
    tableName: 'knex_migrations',
    extension: 'ts',
  },
  seeds: {
    directory: path.join(BASE_PATH, 'seeds'),
    extension: 'ts',
  },
  pool: client === 'sqlite3' ? {
    afterCreate: (conn: any, done: Function) => {
      conn.run('PRAGMA foreign_keys = ON', done);
    },
  } : {
    min: 2,
    max: 10,
    createTimeoutMillis: 3000,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 100,
    propagateCreateError: false, // <- default is true, set to false
  },
};

export default config;
