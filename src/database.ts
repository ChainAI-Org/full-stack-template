import knex from 'knex';
import type { Knex as KnexType } from 'knex';
import knexConfig from '../knexfile.js'; // knexfile now exports the config directly
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

/**
 * Interface for a Task record in the database.
 */
export interface Task {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string; // To track the last modification time
}

// Database interaction functions

/**
 * Retrieves all tasks from the database, ordered by ID.
 * @returns A promise that resolves to an array of tasks.
 */
export async function getAllTasks(): Promise<Task[]> {
  const tasks = await db('tasks').select('*').orderBy('id', 'asc');
  return tasks;
}

/**
 * Adds a new task to the database.
 * @param title The title of the task.
 * @returns A promise that resolves to the newly created task.
 */
export async function addTask(title: string): Promise<Task> {
  const [newTask] = await db('tasks')
    .insert({ title, completed: false }) // created_at and updated_at will use defaultTo(knex.fn.now())
    .returning('*');
  return newTask;
}

/**
 * Deletes a task from the database by its ID.
 * @param id The ID of the task to delete.
 * @returns A promise that resolves when the task is deleted.
 */
export async function deleteTask(id: number): Promise<void> {
  await db('tasks').where({ id }).del();
}

/**
 * Toggles the completion status of a task and updates its 'updated_at' timestamp.
 * @param id The ID of the task to update.
 * @returns A promise that resolves to the updated task, or undefined if the task is not found.
 */
export async function toggleTaskCompletion(id: number): Promise<Task | undefined> {
  const task = await db('tasks').where({ id }).first();

  if (!task) {
    return undefined;
  }

  const [updatedTask] = await db('tasks')
    .where({ id })
    .update({
      completed: !task.completed,
      updated_at: db.fn.now(), // Explicitly update the updated_at timestamp
    })
    .returning('*');
  
  return updatedTask;
}

export default db;
