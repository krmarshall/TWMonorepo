/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.js', './src/**/*.ts', './src/**/*.jsx', './src/**/*.tsx', 
  './TotalWarhammerPlanner/frontend/src/**/*.js', './TotalWarhammerPlanner/frontend/src/**/*.ts', 
  './TotalWarhammerPlanner/frontend/src/**/*.jsx', './TotalWarhammerPlanner/frontend/src/**/*.tsx',],
  theme: {
    extend: {
      fontFamily: {
        CaslonAntique: 'CaslonAntique',
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
};
