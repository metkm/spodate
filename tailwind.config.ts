import type { Config } from 'tailwindcss';

export default {
  content: [],
  theme: {
    extend: {
      animation: {
        'cover-spin': 'spin 15s linear infinite;',
      },
      transitionDuration: {
        15000: '15000ms',
      },
    },
  },
  plugins: [],
} satisfies Config;
