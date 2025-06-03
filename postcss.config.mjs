// Import plugins directly for ESM compatibility
import tailwindcssPostcss from '@tailwindcss/postcss';
import postcssPresetEnv from 'postcss-preset-env';

export default {
  plugins: [
    tailwindcssPostcss(),
    postcssPresetEnv({
      stage: 1,
      features: {
        'nesting-rules': false
      }
    })
  ]
};
