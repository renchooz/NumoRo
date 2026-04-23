/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          400: "#8b5cf6",
          500: "#7c3aed"
        }
      },
      boxShadow: {
        glass: "0 10px 30px rgba(124, 58, 237, 0.18)"
      }
    }
  },
  plugins: []
};

