/** @type {import('tailwindcss').Config} */
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in a way that works with ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  content: [
    path.join(__dirname, 'src/client/index.html'),
    path.join(__dirname, 'src/client/**/*.{jsx,tsx}'),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
