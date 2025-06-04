import type { FastifyInstance } from 'fastify';
import { registerTaskDecorators } from './task.decorators.js';

/**
 * Registers all decorators with the Fastify server
 * This acts as a centralized location for all decorators
 * @param fastify The Fastify instance
 */
export function registerDecorators(fastify: FastifyInstance): void {
  // Register task decorators
  registerTaskDecorators(fastify);
  
  // Register other category decorators here
  // registerUserDecorators(fastify);
  // registerAuthDecorators(fastify);
}
