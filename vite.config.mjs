import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import viteReact from '@vitejs/plugin-react';
import viteFastifyReact from '@fastify/react/plugin';

// Recreate __dirname for ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Explicitly point to the PostCSS config file
const postcssConfigFile = resolve(__dirname, 'postcss.config.mjs');

export default {
  root: join(__dirname, 'src', 'client'),
  build: {
    emptyOutDir: true,
    outDir: join(__dirname, 'dist'),
  },
  css: {
    postcss: {
      // Use an explicit path to the PostCSS config
      config: postcssConfigFile
    }
  },
  plugins: [
    viteReact(),
    viteFastifyReact({
      ts: true
    }),
  ],
}
