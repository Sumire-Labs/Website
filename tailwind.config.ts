import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Material Design 3 Expressive カラーパレット
        primary: {
          light: '#5865F2',
          dark: '#A8C7FA',
        },
        secondary: {
          light: '#8B5CF6',
          dark: '#D0BCFF',
        },
        surface: {
          light: '#FEFBFF',
          dark: '#1C1B1F',
        },
        'surface-container': {
          light: '#F3EDF7',
          dark: '#2B2930',
        },
        'surface-container-high': {
          light: '#ECE6F0',
          dark: '#36343B',
        },
        'on-surface': {
          light: '#1C1B1F',
          dark: '#E6E1E5',
        },
        'on-surface-variant': {
          light: '#49454F',
          dark: '#CAC4D0',
        },
        background: {
          light: '#FEFBFF',
          dark: '#1C1B1F',
        },
        outline: {
          light: '#79747E',
          dark: '#938F99',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'Noto Sans JP', 'sans-serif'],
      },
      boxShadow: {
        'md3-1': '0 1px 2px 0 rgba(0, 0, 0, 0.3), 0 1px 3px 1px rgba(0, 0, 0, 0.15)',
        'md3-2': '0 1px 2px 0 rgba(0, 0, 0, 0.3), 0 2px 6px 2px rgba(0, 0, 0, 0.15)',
        'md3-3': '0 4px 8px 3px rgba(0, 0, 0, 0.15), 0 1px 3px 0 rgba(0, 0, 0, 0.3)',
      },
      borderRadius: {
        'md3-xs': '4px',
        'md3-sm': '8px',
        'md3-md': '12px',
        'md3-lg': '16px',
        'md3-xl': '28px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} satisfies Config
