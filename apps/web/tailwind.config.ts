import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['app/**/*.{ts,tsx}', 'src/**/*.{ts,tsx}', '../../packages/ui-kit/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f9f7',
          100: '#d8f0e8',
          200: '#b0ddcf',
          300: '#7cc2ad',
          400: '#46a18a',
          500: '#2d846f',
          600: '#226956',
          700: '#1c5546',
          800: '#184539',
          900: '#12312a'
        }
      }
    }
  },
  plugins: []
};

export default config;
