/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        copper: {
          50: "#fff7f1",
          100: "#ffe8d6",
          200: "#ffd2ad",
          300: "#ffb57a",
          400: "#f28d45",
          500: "#d97735",
          600: "#b85f2b",
          700: "#944923",
          800: "#763a1d",
          900: "#5a2d17",
        },
      },
      boxShadow: {
        soft: "0 10px 30px rgba(2,6,23,.10)",
        card: "0 8px 24px rgba(2,6,23,.10)",
        glow: "0 0 0 6px rgba(217,119,53,.15)",
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};