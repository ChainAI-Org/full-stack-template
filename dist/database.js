import knex from 'knex';
import knexConfig from '../knexfile.js';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
if (knexConfig.client === 'sqlite3' &&
    typeof knexConfig.connection === 'object' &&
    knexConfig.connection !== null &&
    'filename' in knexConfig.connection &&
    typeof knexConfig.connection.filename === 'string') {
    const dbPath = knexConfig.connection.filename;
    const dbDir = dirname(dbPath);
    if (!existsSync(dbDir)) {
        try {
            mkdirSync(dbDir, { recursive: true });
            console.log(`Created directory for SQLite database: ${dbDir}`);
        }
        catch (error) {
            console.error(`Failed to create directory ${dbDir}:`, error);
        }
    }
}
const db = knex(knexConfig);
db.raw('SELECT 1')
    .then(() => {
    console.log(`Successfully connected to the database using client: '${knexConfig.client}'.`);
    if (knexConfig.client === 'sqlite3' &&
        typeof knexConfig.connection === 'object' &&
        knexConfig.connection &&
        'filename' in knexConfig.connection) {
        console.log(`SQLite database is configured at: ${knexConfig.connection.filename}`);
    }
    else if (typeof knexConfig.connection === 'string') {
        console.log(`Using connection string: ${knexConfig.connection}`);
    }
    else if (typeof knexConfig.connection === 'object') {
        const connDetails = knexConfig.connection;
        console.log(`Connected to host: ${connDetails.host}, database: ${connDetails.database}`);
    }
})
    .catch((err) => {
    console.error(`Failed to connect to the database. Please check your environment variables and knexfile.ts. Client: '${knexConfig.client}'`, err);
});
export async function getAllTasks() {
    const tasks = await db('tasks').select('*').orderBy('id', 'asc');
    return tasks;
}
export async function addTask(title) {
    const [newTask] = await db('tasks')
        .insert({ title, completed: false })
        .returning('*');
    return newTask;
}
export async function deleteTask(id) {
    await db('tasks').where({ id }).del();
}
export async function toggleTaskCompletion(id) {
    const task = await db('tasks').where({ id }).first();
    if (!task) {
        return undefined;
    }
    const [updatedTask] = await db('tasks')
        .where({ id })
        .update({
        completed: !task.completed,
        updated_at: db.fn.now(),
    })
        .returning('*');
    return updatedTask;
}
export default db;
//# sourceMappingURL=database.js.map