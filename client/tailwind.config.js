/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#1B2A4A',
          light: '#2E4270',
          dark: '#101A30',
        },
        paper: '#FAF6EC',
        marigold: {
          DEFAULT: '#E8A33D',
          dark: '#C9821E',
        },
        vermilion: '#C1442D',
        moss: '#3F7A5C',
        line: '#D9D2C2',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      borderRadius: {
        sm: '3px',
        DEFAULT: '4px',
        md: '6px',
        lg: '10px',
      },
    },
  },
  plugins: [],
};
