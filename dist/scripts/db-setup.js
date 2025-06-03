import knex from 'knex';
import config from '../knexfile.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SETUP_MARKER_FILE = path.join(__dirname, '..', '.db-setup-complete');
async function checkIfMigrationsNeeded() {
    if (fs.existsSync(SETUP_MARKER_FILE)) {
        console.log('Database setup already completed. Skipping migrations and seeds.');
        return false;
    }
    return true;
}
async function markSetupComplete() {
    fs.writeFileSync(SETUP_MARKER_FILE, new Date().toISOString());
    console.log('Database setup marked as complete.');
}
async function main() {
    try {
        const setupNeeded = await checkIfMigrationsNeeded();
        if (setupNeeded) {
            console.log('Running database migrations and seeds...');
            const db = knex(config);
            console.log('Running migrations...');
            await db.migrate.latest();
            console.log('Running seeds...');
            await db.seed.run();
            await markSetupComplete();
            await db.destroy();
            console.log('Database setup completed successfully.');
        }
    }
    catch (error) {
        console.error('Error setting up database:', error);
        process.exit(1);
    }
}
main();
//# sourceMappingURL=db-setup.js.map