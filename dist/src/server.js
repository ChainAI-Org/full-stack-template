import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Fastify from 'fastify';
import FastifyVite from '@fastify/vite';
import FastifyFormBody from '@fastify/formbody';
import { getAllTasks, addTask, deleteTask } from './database.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const server = Fastify({
    logger: {
        transport: {
            target: '@fastify/one-line-logger'
        }
    }
});
await server.register(FastifyFormBody);
await server.register(FastifyVite, {
    root: resolve(__dirname, '..'),
    distDir: __dirname,
    renderer: '@fastify/react',
});
await server.vite.ready();
server.decorate('todoList', async () => {
    return await getAllTasks();
});
server.get('/api/tasks', async (req, reply) => {
    const tasks = await getAllTasks();
    reply.send(tasks);
});
server.post('/api/tasks', async (req, reply) => {
    await addTask(req.body.title);
    const tasks = await getAllTasks();
    reply.send(tasks);
});
server.delete('/api/tasks', async (req, reply) => {
    await deleteTask(req.body.id);
    const tasks = await getAllTasks();
    reply.send(tasks);
});
await server.listen({ port: 3000 });
//# sourceMappingURL=server.js.map