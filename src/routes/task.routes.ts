import type { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';
import {
  getAllTasks,
  addTask,
  deleteTask,
  toggleTaskCompletion} from '../models/task.model.js'; // Note .js extension for ES module imports
import { requireAuth } from '../middleware/auth.middleware.js';

// Interface for the request body when adding a new task
interface AddTaskBody {
  title: string;
}

// Interface for route parameters that include an ID
interface TaskIdParam {
  id: string; // Route parameters are initially strings
}

export default async function taskRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
  // GET all tasks - authenticated route gets user's tasks
  fastify.get('/', { 
    // Use the preHandler hook for authentication instead of manual auth check
    preHandler: requireAuth 
  }, async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      // At this point, authentication has already been verified by the preHandler hook
      // and req.user is guaranteed to exist
      const tasks = await getAllTasks(req.user!.id);
      return reply.send(tasks);
    } catch (error) {
      return reply.status(500).send({ error: 'Failed to retrieve tasks' });
    }
  });

  // POST a new task - requires authentication
  fastify.post<{ Body: AddTaskBody }>(  
    '/', 
    { preHandler: requireAuth },
    async (req, reply) => {
      try {
        const { title } = req.body;
        if (!title || typeof title !== 'string' || title.trim() === '') {
          return reply.status(400).send({ error: 'Task title is required and must be a non-empty string.' });
        }
        
        // Use the authenticated user's ID
        await addTask(title, req.user!.id);
        
        // Return user's tasks
        const tasks = await getAllTasks(req.user!.id);
        reply.status(201).send(tasks); // 201 Created
      } catch (error) {
        reply.status(500).send({ error: 'Failed to create task' });
      }
    }
  );

  // No public task endpoints - all tasks require authentication

  // DELETE a task by ID - requires authentication
  fastify.delete<{ Params: TaskIdParam }>(  
    '/:id', 
    { preHandler: requireAuth },
    async (req, reply) => {
      try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
          return reply.status(400).send({ error: 'Task ID must be a valid number.' });
        }
        
        try {
          // Will throw error if task not found or doesn't belong to user
          await deleteTask(id, req.user!.id);
          
          // Return updated list of user's tasks
          const tasks = await getAllTasks(req.user!.id);
          reply.send(tasks);
        } catch (error) {
          return reply.status(404).send({ error: 'Task not found or you do not have permission to delete it' });
        }
      } catch (error) {
        reply.status(500).send({ error: 'Failed to delete task' });
      }
    }
  );

  // PATCH to toggle a task's completion status by ID - requires authentication
  fastify.patch<{ Params: TaskIdParam }>(  
    '/:id/toggle', 
    { preHandler: requireAuth },
    async (req, reply) => {
      try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
          return reply.status(400).send({ error: 'Task ID must be a valid number.' });
        }
        
        // Will return undefined if task not found or doesn't belong to user
        const updatedTask = await toggleTaskCompletion(id, req.user!.id);
        
        if (!updatedTask) {
          return reply.status(404).send({ error: 'Task not found or you do not have permission to update it' });
        }
        
        // Return updated list of user's tasks
        const tasks = await getAllTasks(req.user!.id);
        reply.send(tasks);
      } catch (error) {
        reply.status(500).send({ error: 'Failed to update task' });
      }
    }
  );
  
  // Add a new public task endpoint (no auth required)
  fastify.post<{ Body: AddTaskBody }>('/public', async (req, reply) => {
    try {
      const { title } = req.body;
      if (!title || typeof title !== 'string' || title.trim() === '') {
        return reply.status(400).send({ error: 'Task title is required and must be a non-empty string.' });
      }
      
      // Create public task (null user_id)
      await addTask(title); 
      
      // Return public tasks
      const tasks = await getAllTasks();
      reply.status(201).send(tasks);
    } catch (error) {
      reply.status(500).send({ error: 'Failed to create public task' });
    }
  });
}
