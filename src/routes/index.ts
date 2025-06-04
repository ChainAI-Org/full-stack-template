import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import taskRoutes from './task.routes.js';
import userRoutes from './user.routes.js';

// Register all route plugins with prefix
export default async function routes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
  // Register user authentication routes
  await fastify.register(userRoutes, { prefix: '/auth' });
  
  // Register task routes under /api prefix
  await fastify.register(taskRoutes, { prefix: '/tasks' });
  
  // Register additional routes here as your application grows
  // await fastify.register(projectRoutes, { prefix: '/projects' });
}
