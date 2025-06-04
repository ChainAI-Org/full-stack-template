import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import Fastify from 'fastify'
import FastifyVite from '@fastify/vite'
import FastifyFormBody from '@fastify/formbody'
// sqlite3 import removed - using Knex now
import { getAllTasks, addTask, deleteTask } from './database.js';

// Determine execution environment and project root
const _currentServerFileDirname = dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';
// In dev (src/server.ts), _currentServerFileDirname is PROJECT_ROOT/src/. Project root is '..'.
// In prod (dist/server.js), _currentServerFileDirname is PROJECT_ROOT/dist/. Project root is '..'.
const __projectRoot = resolve(_currentServerFileDirname, '..');

const clientBuildOutputDir = join(__projectRoot, 'dist');

// Database interface removed - using Knex now

const server = Fastify({
  logger: {
    transport: {
      target: '@fastify/one-line-logger'
    }
  }
})

await server.register(FastifyFormBody)

await server.register(FastifyVite, {
  root: __projectRoot,       // Set @fastify/vite root to project root
  renderer: '@fastify/react',
  // In production, distDir points to where client assets are (PROJECT_ROOT/dist).
  // This was the configuration when the production server started successfully.
  distDir: isProduction ? clientBuildOutputDir : undefined,
  // viteConfig option removed; @fastify/vite will look for vite.config.js in its root (__projectRoot)
})

await server.vite.ready()

// Database is now initialized via Knex in the imported functions

// Decorate server with todoList for client-side context
server.decorate('todoList', async () => {
  return await getAllTasks();
})

// Get all tasks
server.get('/api/tasks', async (req, reply) => {
  const tasks = await getAllTasks();
  reply.send(tasks);
})

// Add a new task
server.post<{
  Body: { title: string }
}>('/api/tasks', async (req, reply) => {
  await addTask(req.body.title)
  const tasks = await getAllTasks()
  reply.send(tasks)
})

// Delete a task
server.delete<{
  Body: { id: number }
}>('/api/tasks', async (req, reply) => {
  await deleteTask(req.body.id)
  const tasks = await getAllTasks()
  reply.send(tasks)
})

const port = 3000;
const host = '0.0.0.0';

await server.listen({
  port,
  host,
  listenTextResolver: (address) => {
    // The 'address' parameter (e.g., 'http://127.0.0.1:3000') is available but ignored here.
    // We construct the desired log message using the configured host and port.
    return `Server listening at http://${host}:${port}`;
  }
});
