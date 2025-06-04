import type { FastifyRequest, FastifyReply } from 'fastify';
import { verifyToken } from '../models/user.model.js';

/**
 * Middleware to verify user authentication via JWT token in Authorization header
 */
export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    reply.status(401).send({ error: 'Authentication required' });
    return;
  }
  
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  
  if (!decoded) {
    reply.status(401).send({ error: 'Invalid or expired token' });
    return;
  }
  
  // Attach the user ID to the request for use in route handlers
  request.user = { id: decoded.userId, email: decoded.email };
}

// Extending FastifyRequest to include the user property
declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: number;
      email: string;
    };
  }
}
