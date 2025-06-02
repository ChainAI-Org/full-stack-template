import { resolve } from 'node:path'
import Fastify from 'fastify'
import FastifyVite from '@fastify/vite'
import FastifyFormBody from '@fastify/formbody'
import sqlite3 from 'sqlite3'
import { setupDatabase, getAllTasks, addTask, deleteTask } from './database'

interface Database {
  db: sqlite3.Database
}

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
  root: resolve(import.meta.dirname, '..'),
  distDir: import.meta.dirname, // This file will also live in the dist folder when built
  renderer: '@fastify/react',
})

await server.vite.ready()

// Initialize and setup SQLite database
const sqliteDb = await setupDatabase()

// Decorate server with database instance
server.decorate<Database>('db', {
  db: sqliteDb
})

// Get all tasks
server.get('/api/tasks', async (req, reply) => {
  const dbInstance = server.getDecorator<Database>('db').db
  const tasks = await getAllTasks(dbInstance)
  reply.send(tasks)
})

// Add a new task
server.post<{
  Body: { title: string }
}>('/api/tasks', async (req, reply) => {
  const dbInstance = server.getDecorator<Database>('db').db
  await addTask(dbInstance, req.body.title)
  const tasks = await getAllTasks(dbInstance)
  reply.send(tasks)
})

// Delete a task
server.delete<{
  Body: { id: number }
}>('/api/tasks', async (req, reply) => {
  const dbInstance = server.getDecorator<Database>('db').db
  await deleteTask(dbInstance, req.body.id)
  const tasks = await getAllTasks(dbInstance)
  reply.send(tasks)
})

await server.listen({ port: 3000 })
