import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import viteReact from '@vitejs/plugin-react';
import viteFastifyReact from '@fastify/react/plugin';

// Import PostCSS plugins
import tailwindcssPostcss from '@tailwindcss/postcss';
import postcssPresetEnv from 'postcss-preset-env';

// Recreate __dirname for ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  root: join(__dirname, 'src', 'client'),
  build: {
    emptyOutDir: true,
    outDir: join(__dirname, 'dist'),
  },
  css: {
    postcss: {
      plugins: [
        tailwindcssPostcss(),
        postcssPresetEnv({
          stage: 1,
          features: {
            'nesting-rules': false
          }
        })
      ]
    }
  },
  plugins: [
    viteReact(),
    viteFastifyReact({
      ts: true
    }),
  ],
}
