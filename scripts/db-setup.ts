import knex from 'knex';
import config from '../knexfile.js'; // Note: TypeScript compiles to .js
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SETUP_MARKER_FILE = path.join(__dirname, '..', '.db-setup-complete');

async function checkIfMigrationsNeeded() {
  // If the marker file exists, assume setup is complete
  if (fs.existsSync(SETUP_MARKER_FILE)) {
    console.log('Database setup already completed. Skipping migrations and seeds.');
    return false;
  }
  
  // Otherwise, we need to run migrations and seeds
  return true;
}

async function markSetupComplete() {
  // Create a marker file to indicate setup is complete
  fs.writeFileSync(SETUP_MARKER_FILE, new Date().toISOString());
  console.log('Database setup marked as complete.');
}

async function main() {
  try {
    const setupNeeded = await checkIfMigrationsNeeded();
    
    if (setupNeeded) {
      console.log('Running database migrations and seeds...');
      
      // Initialize knex with our config
      const db = knex(config);
      
      // Run migrations
      console.log('Running migrations...');
      await db.migrate.latest();
      
      // Run seeds
      console.log('Running seeds...');
      await db.seed.run();
      
      // Mark setup as complete
      await markSetupComplete();
      
      // Close the connection
      await db.destroy();
      
      console.log('Database setup completed successfully.');
    }
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

// Run the main function
main();
