import type { FastifyInstance, FastifyRequest } from 'fastify';
import { getAllTasks } from '../models/task.model.js'; // Using .js extension for ES modules
import { verifyToken } from '../models/user.model.js';

/**
 * Registers the task-related decorators with the Fastify server
 * @param fastify The Fastify instance
 */
export function registerTaskDecorators(fastify: FastifyInstance): void {
  // Decorate server with todoList for client-side context
  fastify.decorate('todoList', async (request?: FastifyRequest) => {
    // If the request has an auth token, use it to fetch user-specific tasks
    let userId: number | undefined;
    
    if (request) {
      // Check for JWT token in cookies or authorization header
      const cookieToken = request.cookies?.auth_token;
      const authHeader = request.headers.authorization;
      let token = '';
      
      if (cookieToken) {
        token = cookieToken;
      } else if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
      
      if (token) {
        const decoded = verifyToken(token);
        if (decoded) {
          userId = decoded.userId;
        }
      }
    }
    
    // If we have a user ID, fetch their tasks, otherwise fetch public tasks
    return await getAllTasks(userId);
  });
  
  // Add more task-related decorators here as needed
}
