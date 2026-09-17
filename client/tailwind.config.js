/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette — G-PAGES
        ink: {
          DEFAULT: '#0D1B3E',   // deep navy (logo "PAGES" colour)
          light: '#1B2A55',
          dark: '#060F24',
        },
        paper: '#FFFFFF',
        marigold: {
          DEFAULT: '#F47224',   // brand orange (logo pin colour)
          dark: '#D9621A',
        },
        accent: {
          DEFAULT: '#1A56DB',   // brand blue (logo "G" colour)
          light: '#3B6FEF',
          pale: '#EBF0FF',
        },
        vermilion: '#E53E3E',
        moss: '#2E7D5E',
        line: '#E2E8F0',
        canvas: '#F5F7FA',      // light-grey section backgrounds
      },
      fontFamily: {
        display: ['"Inter"', 'sans-serif'],
        body:    ['"Inter"', 'sans-serif'],
        sans:    ['"Inter"', 'sans-serif'],
      },
      borderRadius: {
        sm:  '4px',
        DEFAULT: '6px',
        md:  '8px',
        lg:  '12px',
        xl:  '16px',
        '2xl': '20px',
      },
    },
  },
  plugins: [],
};
