import knex from 'knex';
import type { Knex as KnexType } from 'knex';
import knexConfig from './knexfile.js'; // knexfile now exports the config directly
import { existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

// The knexConfig is now the direct configuration object,
// dynamically built by knexfile.ts based on environment variables.

// Ensure the directory for SQLite database exists if using SQLite.
if (
  knexConfig.client === 'sqlite3' &&
  typeof knexConfig.connection === 'object' && // Check it's an object, not a connection string
  knexConfig.connection !== null &&
  'filename' in knexConfig.connection && // Type guard
  typeof (knexConfig.connection as { filename: string }).filename === 'string'
) {
  const dbPath = (knexConfig.connection as { filename: string }).filename;
  const dbDir = dirname(dbPath);
  if (!existsSync(dbDir)) {
    try {
      mkdirSync(dbDir, { recursive: true });
      console.log(`Created directory for SQLite database: ${dbDir}`);
    } catch (error) {
      console.error(`Failed to create directory ${dbDir}:`, error);
      // Depending on the application's needs, you might want to re-throw or exit
    }
  }
}

// Initialize Knex with the resolved config
const db: KnexType = knex(knexConfig);

// Optional: Test the connection and log status.
db.raw('SELECT 1')
  .then(() => {
    console.log(`Successfully connected to the database using client: '${knexConfig.client}'.`);
    if (
      knexConfig.client === 'sqlite3' &&
      typeof knexConfig.connection === 'object' &&
      knexConfig.connection &&
      'filename' in knexConfig.connection
    ) {
      console.log(`SQLite database is configured at: ${(knexConfig.connection as { filename: string }).filename}`);
    } else if (typeof knexConfig.connection === 'string') {
      console.log(`Using connection string: ${knexConfig.connection}`);
    } else if (typeof knexConfig.connection === 'object') {
        const connDetails = knexConfig.connection as KnexType.ConnectionConfig;
        console.log(`Connected to host: ${connDetails.host}, database: ${connDetails.database}`);
    }
  })
  .catch((err) => {
    console.error(`Failed to connect to the database. Please check your environment variables and knexfile.ts. Client: '${knexConfig.client}'`, err);
    // process.exit(1);
  });

export default db;
