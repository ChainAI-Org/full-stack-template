// tailwind.config.js

/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin'; // Changed to import

export default {
  content: [
    './src/client/**/*.{js,ts,jsx,tsx,html}',
    './index.html',
  ],
  darkMode: 'class',
  theme: {
    // Define the entire theme structure correctly
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      // Dark Mode Palette
      'brand-dark-bg': '#10121A',
      'brand-dark-surface': '#1C1F2A',
      'brand-dark-border': '#303442',
      'brand-dark-text-primary': '#F0F2F5',
      'brand-dark-text-secondary': '#BCC5D9', // Made lighter for better contrast
      'brand-dark-text-tertiary': '#70788C',
      // Light Mode Palette
      'brand-light-bg': '#F8F9FC',
      'brand-light-surface': '#FFFFFF',
      'brand-light-border': '#E0E4EB',
      'brand-light-text-primary': '#1C1F2A',
      'brand-light-text-secondary': '#4A4F5D',
      'brand-light-text-tertiary': '#70788C',
      // Accents
      'brand-accent-blue': {
        DEFAULT: '#2563EB',    // Primary blue for light mode (e.g., button backgrounds, link text)
        textOnBlue: '#FFFFFF',  // Text color for on-blue backgrounds
        dark: '#60A5FA',       // Lighter blue, for link text in dark mode (used by text-brand-accent-blue in dark mode)
        darkBg: '#1D4ED8'      // Darker blue, for button backgrounds in dark mode (e.g. bg-brand-accent-blue-darkBg)
      },
      'brand-accent-cyan': {
        light: '#22D3EE', DEFAULT: '#06B6D4', dark: '#0E7490', text: '#FFFFFF'
      },
      'brand-accent-orange': {
        light: '#F97316', DEFAULT: '#EA580C', dark: '#C2410C', text: '#FFFFFF'
      },
      'brand-accent-success': {
        light: '#22C55E', DEFAULT: '#16A34A', dark: '#15803D', text: '#FFFFFF'
      },
      'brand-accent-error': {
        light: '#EF4444', DEFAULT: '#DC2626', dark: '#B91C1C', text: '#FFFFFF'
      },
      'brand-accent-warning': {
        light: '#F59E0B', DEFAULT: '#D97706', dark: '#B45309', text: '#FFFFFF'
      },
      // Base Tailwind colors (optional, can be removed if not directly used)
      black: '#000',
      white: '#fff',
      gray: {
        50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 400: '#9ca3af',
        500: '#6b7280', 600: '#4b5563', 700: '#374151', 800: '#1f2937', 900: '#111827',
        950: '#030712',
      },
      red: { // Example: keep red for error states if not using brand-accent-error
        50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5', 400: '#f87171',
        500: '#ef4444', 600: '#dc2626', 700: '#b91c1c', 800: '#991b1b', 900: '#7f1d1d',
        950: '#450a0a',
      },
    },
    spacing: {
      '0': '0', 'px': '1px', '0.5': '0.125rem', '1': '0.25rem', '1.5': '0.375rem',
      '2': '0.5rem', '2.5': '0.625rem', '3': '0.75rem', '3.5': '0.875rem',
      '4': '1rem', '5': '1.25rem', '6': '1.5rem', '7': '1.75rem', '8': '2rem',
      '9': '2.25rem', '10': '2.5rem', '11': '2.75rem', '12': '3rem', '14': '3.5rem',
      '16': '4rem', '20': '5rem', '24': '6rem', '28': '7rem', '32': '8rem',
      '36': '9rem', '40': '10rem', '44': '11rem', '48': '12rem', '52': '13rem',
      '56': '14rem', '60': '15rem', '64': '16rem', '72': '18rem', '80': '20rem',
      '96': '24rem',
    },
    borderRadius: {
      'none': '0', 'sm': '0.25rem', 'DEFAULT': '0.5rem', 'md': '0.75rem',
      'lg': '1rem', 'xl': '1.5rem', '2xl': '2rem', '3xl': '3rem', 'full': '9999px',
    },
    extend: {
      // No custom 'colors' in extend, they are all defined at the top level of theme.colors
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
        serif: ['Lora', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
      },
      boxShadow: {
        'subtle-sm': '0 2px 4px 0px rgba(0,0,0,0.03), 0 1px 2px 0px rgba(0,0,0,0.02)',
        'subtle': '0 4px 8px 0px rgba(0,0,0,0.04), 0 2px 4px 0px rgba(0,0,0,0.03)',
        'subtle-md': '0 6px 12px 0px rgba(0,0,0,0.05), 0 3px 6px 0px rgba(0,0,0,0.04)',
        'subtle-lg': '0 10px 20px 0px rgba(0,0,0,0.05), 0 5px 10px 0px rgba(0,0,0,0.04)',
        'dark-subtle-sm': '0 2px 4px 0px rgba(240,242,245,0.02), 0 1px 2px 0px rgba(240,242,245,0.01)',
        'dark-subtle': '0 4px 8px 0px rgba(240,242,245,0.03), 0 2px 4px 0px rgba(240,242,245,0.02)',
        'dark-subtle-md': '0 6px 12px 0px rgba(240,242,245,0.04), 0 3px 6px 0px rgba(240,242,245,0.03)',
        'dark-subtle-lg': '0 10px 20px 0px rgba(240,242,245,0.04), 0 5px 10px 0px rgba(240,242,245,0.03)',
      },
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        'subtle': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        'DEFAULT': '250ms', 'fast': '150ms', 'slow': '400ms',
      },
    },
  },
  plugins: [
    plugin(function({ addBase, theme }) {
      addBase({
        'html.dark': {
          'color': theme('colors.brand-dark-text-primary'),
          'background-color': theme('colors.brand-dark-bg'),
        },
        'html:not(.dark)': {
          'color': theme('colors.brand-light-text-primary'),
          'background-color': theme('colors.brand-light-bg'),
        }
      })
    })
  ],
}
