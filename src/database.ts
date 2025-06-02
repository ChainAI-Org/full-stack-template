import sqlite3 from 'sqlite3';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';

// Database path
const DB_PATH = resolve(process.cwd(), 'data.db');

// Database helper that wraps SQLite operations in promises
class SQLiteDB {
  private db: sqlite3.Database;

  constructor(db: sqlite3.Database) {
    this.db = db;
  }

  // Execute an SQL query that doesn't return data
  async run(sql: string, params: any[] = []): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  // Execute an SQL query that returns all matching rows
  async all(sql: string, params: any[] = []): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  // Execute an SQL query that returns the first matching row
  async get(sql: string, params: any[] = []): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }

  // Close the database connection
  async close(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.db.close(err => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}

// Initialize the database
export async function setupDatabase(): Promise<SQLiteDB> {
  console.log('Setting up SQLite database at:', DB_PATH);
  
  // Create database connection
  const sqliteDb = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
      throw err;
    }
  });
  
  const db = new SQLiteDB(sqliteDb);
  
  // Enable foreign keys
  await db.run('PRAGMA foreign_keys = ON');

  // Create schema
  await createSchema(db);

  // Seed data if needed
  await seedData(db);

  return db;
}

// Create database schema
async function createSchema(db: SQLiteDB): Promise<void> {
  console.log('Creating database schema');
  
  // Create tasks table
  await db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// Seed initial data
async function seedData(db: SQLiteDB): Promise<void> {
  // Check if we already have data
  const result = await db.get('SELECT COUNT(*) as count FROM tasks');
  
  // Only seed if no data exists
  if (result.count === 0) {
    console.log('Seeding database with initial data');
    
    // Sample task titles
    const tasks = [
      'Complete project documentation',
      'Deploy application to production',
      'Set up CI/CD pipeline',
      'Review pull requests',
      'Fix UI responsiveness issue',
      'Write unit tests for new features'
    ];
    
    // Add each task
    for (const task of tasks) {
      await db.run('INSERT INTO tasks (title) VALUES (?)', [task]);
    }
    
    console.log('Database seeded with initial data');
  }
}

// Get all tasks
export async function getAllTasks(db: SQLiteDB): Promise<any[]> {
  return db.all('SELECT * FROM tasks ORDER BY created_at DESC');
}

// Add a new task
export async function addTask(db: SQLiteDB, title: string): Promise<void> {
  await db.run('INSERT INTO tasks (title) VALUES (?)', [title]);
}

// Delete a task
export async function deleteTask(db: SQLiteDB, id: number): Promise<void> {
  await db.run('DELETE FROM tasks WHERE id = ?', [id]);
}

// Toggle task completion status
export async function toggleTaskCompletion(db: SQLiteDB, id: number): Promise<void> {
  await db.run('UPDATE tasks SET completed = NOT completed WHERE id = ?', [id]);
}
