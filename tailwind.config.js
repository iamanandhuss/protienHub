/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './views/**/*.{ejs,js}', // This scans EJS files in the views folder
    './components/**/*.{ejs,js}', // If you have components, include them
    './src/**/*.{ejs,js}', // Scan any other source files if applicable
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

