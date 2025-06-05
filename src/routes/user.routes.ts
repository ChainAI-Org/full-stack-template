import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { 
  registerUser, 
  loginUser, 
  getUserById
} from '../models/user.model.js';
// Import types separately with the 'type' keyword
import type { UserRegistration } from '../models/user.model.js';
import { requireAuth } from '../middleware/auth.middleware.js';

interface RegistrationBody {
  username: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

export default async function userRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
  // User registration
  fastify.post<{ Body: RegistrationBody }>('/register', async (request, reply) => {
    try {
      const { username, email, password } = request.body;
      
      // Validate input
      if (!username || !email || !password) {
        return reply.status(400).send({ error: 'Username, email, and password are required' });
      }
      
      if (password.length < 8) {
        return reply.status(400).send({ error: 'Password must be at least 8 characters long' });
      }
      
      const userData: UserRegistration = { username, email, password };
      const newUser = await registerUser(userData);
      
      reply.status(201).send({ user: newUser });
    } catch (error) {
      // Handle known business logic errors
      if (error instanceof Error) {
        if (error.message === 'Email already in use' || error.message === 'Username already taken') {
          return reply.status(409).send({ error: error.message });
        }
        
        // Log the full error in development to help with debugging
        if (process.env.NODE_ENV !== 'production') {
          console.error('Registration error:', error);
          return reply.status(500).send({ 
            error: 'Registration failed', 
            message: error.message,
            stack: error.stack 
          });
        }
      }
      
      // Generic error for production
      reply.status(500).send({ error: 'Registration failed' });
    }
  });
  
  // User login
  fastify.post<{ Body: LoginBody }>('/login', async (request, reply) => {
    try {
      const { email, password } = request.body;
      
      // Validate input
      if (!email || !password) {
        return reply.status(400).send({ error: 'Email and password are required' });
      }
      
      const result = await loginUser({ email, password });
      
      // Set the token as an HTTP-only cookie for better security
      reply.setCookie('auth_token', result.token, {
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400 // 24 hours
      });
      
      reply.send({ user: result.user, token: result.token });
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid email or password') {
        return reply.status(401).send({ error: 'Invalid email or password' });
      }
      reply.status(500).send({ error: 'Login failed' });
    }
  });
  
  // User logout
  fastify.post('/logout', (request, reply) => {
    // Clear the auth cookie
    reply.clearCookie('auth_token', { path: '/' });
    reply.send({ message: 'Logged out successfully' });
  });
  
  // Get current user profile (requires authentication)
  fastify.get('/me', { preHandler: requireAuth }, async (request, reply) => {
    try {
      const userId = request.user!.id;
      const user = await getUserById(userId);
      
      if (!user) {
        return reply.status(404).send({ error: 'User not found' });
      }
      
      reply.send({ user });
    } catch (error) {
      reply.status(500).send({ error: 'Failed to retrieve user profile' });
    }
  });
}
