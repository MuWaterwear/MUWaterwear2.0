/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './responsive/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          ocean: '#0A3E5C',      // Deep ocean blue
          teal: '#006D7B',       // Primary brand teal
          softTeal: '#4FB0C6',   // Lighter accent teal
          sand: '#F3EEE8',       // Soft sand background
          neutral: '#111827',    // Dark neutral for text
          accent: '#FF725E',     // Warm coral accent for CTAs
        },
      },
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans], // Modern geometric sans-serif
      },
      lineHeight: {
        headingTight: '1.15',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.6s cubic-bezier(.4,0,.2,1) forwards',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(.4,0,.2,1)',
      },
      transitionDuration: {
        fast: '150ms',
        normal: '250ms',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
} 