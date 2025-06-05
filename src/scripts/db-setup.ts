import knex from 'knex';
// Use path alias for config files
import config from '../knexfile.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SETUP_MARKER_FILE = path.join(__dirname, '..', '..', '.db-setup-complete'); // Points to project root

async function checkIfInitialSeedingNeeded() {
  // Check if marker file exists, indicating initial seeding has been done
  if (fs.existsSync(SETUP_MARKER_FILE)) {
    console.log('Initial database seeding already completed (marker file found). Skipping.');
    return false; // Seeding not needed
  }
  
  // Otherwise, initial seeding is required
  console.log('Initial database seeding required (marker file not found).');
  return true; // Seeding needed
}

async function markSetupComplete() {
  // Create a marker file to indicate setup is complete
  fs.writeFileSync(SETUP_MARKER_FILE, new Date().toISOString());
  console.log('Database setup marked as complete.');
}

async function main() {
  try {
    const initialSeedingNeeded = await checkIfInitialSeedingNeeded();
    
    if (initialSeedingNeeded) {
      console.log('Running initial database seeds...');
      
      // Initialize knex with our config
      const db = knex(config);
      
      // Migrations are now run separately by npm scripts.
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
