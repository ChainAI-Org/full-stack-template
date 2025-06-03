import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Fastify from 'fastify'
import FastifyVite from '@fastify/vite'
import FastifyFormBody from '@fastify/formbody'
// sqlite3 import removed - using Knex now
import { getAllTasks, addTask, deleteTask } from './database.js';

// Recreate __dirname for ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
  // TODO handle via CLI path argument with proper resolve
  root: resolve(__dirname, '..'),
  distDir: __dirname, // This file will also live in the dist folder when built
  renderer: '@fastify/react',
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

await server.listen({ port: 3000 })
