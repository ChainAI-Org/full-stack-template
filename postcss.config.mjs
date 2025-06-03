// Import plugins directly for ESM compatibility
import tailwindcssPostcss from '@tailwindcss/postcss';
import postcssPresetEnv from 'postcss-preset-env';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in a way that works with ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Make sure the tailwind config path is absolute
const tailwindConfigPath = path.resolve(__dirname, 'tailwind.config.mjs');

export default {
  plugins: [
    // Pass explicit path to tailwind config
    tailwindcssPostcss({ config: tailwindConfigPath }),
    postcssPresetEnv({
      stage: 1,
      features: {
        'nesting-rules': false
      }
    })
  ]
};
