/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // keep as is
  ],
  theme: {
    extend: {
      colors: {
        // Background gradient colors (adjust as needed)
        'hero-start': '#eaf6fb',
        'hero-mid': '#d6eefb',
        'hero-end': '#cfeaf8',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // optional, but makes inputs look better
  ],
};
