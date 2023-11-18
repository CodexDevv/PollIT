/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        it: "url('/src/assets/it_bg.svg')",
      },
      colors: {
        secondary: '#04395E',
        primary: '#FF1F66',
      },
    },
  },
  plugins: [],
};
