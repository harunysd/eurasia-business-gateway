import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0B1D3A',
        teal: '#169AA5',
        lightTeal: '#A8D5D9',
        gray: {
          DEFAULT: '#6B7280',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['var(--font-heading)', 'var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        container: '1200px',
      },
      spacing: {
        section: '80px',
      },
    },
  },
  plugins: [],
};

export default config;
