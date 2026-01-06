const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-heading)', ...defaultTheme.fontFamily.sans],
        body: ['var(--font-body)', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        // Updated to Bootroom's retro palette: red, yellow and orange
        primary: '#C62d32',    // red
        secondary: '#f8bb13',  // yellow (used for borders and highlights)
        accent: '#E68302',     // orange (secondary accent)
        panel: '#FDF2E9',      // light beige panel background
        background: '#C62d32', // main page background now uses red
        foreground: '#F5F5F5',
      },
    },
  },
  plugins: [],
};