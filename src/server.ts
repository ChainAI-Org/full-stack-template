import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import Fastify from 'fastify';
import FastifyVite from '@fastify/vite';
import FastifyFormBody from '@fastify/formbody';
import FastifyCookie from '@fastify/cookie';
import routes from './routes/index.js'; // Import all routes from index file
import { registerDecorators } from './decorators/index.js'; // Import decorators

// Determine execution environment and project root
const _currentServerFileDirname = dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';
// In dev (src/server.ts), _currentServerFileDirname is PROJECT_ROOT/src/. Project root is '..'.
// In prod (dist/server.js), _currentServerFileDirname is PROJECT_ROOT/dist/. Project root is '..'.
const __projectRoot = resolve(_currentServerFileDirname, '..');

const clientBuildOutputDir = join(__projectRoot, 'dist');

const server = Fastify({
  logger: {
    transport: {
      target: '@fastify/one-line-logger'
    }
  }
});

// Register decorators first, before any plugins
registerDecorators(server);

await server.register(FastifyFormBody);

// Register cookie support for authentication
// Configure cookie plugin to work in all environments including webcontainers
await server.register(FastifyCookie, {
  hook: 'onRequest',
});

// Register all API routes under the /api prefix
await server.register(routes, { prefix: '/api' });

// FastifyVite registration should come after API routes if API is used during SSR/setup
await server.register(FastifyVite, {
  root: __projectRoot,       // Set @fastify/vite root to project root
  renderer: '@fastify/react',
  // In production, distDir points to where client assets are (PROJECT_ROOT/dist).
  distDir: isProduction ? clientBuildOutputDir : undefined,
});

await server.vite.ready();

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
