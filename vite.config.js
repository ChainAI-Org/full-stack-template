import { join } from 'path'

import viteReact from '@vitejs/plugin-react'
import viteFastifyReact from '@fastify/react/plugin'

export default {
  root: join(import.meta.dirname, 'src', 'client'),
  build: {
    emptyOutDir: true,
    outDir: join(import.meta.dirname, 'dist'),
    manifest: true,
  },
  plugins: [
    viteReact(),
    viteFastifyReact({
      ts: true
    }),
  ],
}
