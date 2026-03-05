import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'app-bg': 'var(--bg-color)',
        'app-grid': 'var(--grid-color)',
        'app-text-primary': 'var(--text-primary)',
        'app-text-secondary': 'var(--text-secondary)',
        'app-accent-orange': 'var(--accent-orange)',
        'app-accent-teal': 'var(--accent-teal)',
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
} satisfies Config;
