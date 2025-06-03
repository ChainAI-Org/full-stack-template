import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import viteReact from '@vitejs/plugin-react'
import viteFastifyReact from '@fastify/react/plugin';

// Recreate __dirname for ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  root: join(__dirname, 'src', 'client'),
  build: {
    emptyOutDir: true,
    outDir: join(__dirname, 'dist'),
  },
  plugins: [
    viteReact(),
    viteFastifyReact({
      ts: true
    }),
  ],
}
