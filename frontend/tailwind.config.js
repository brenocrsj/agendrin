export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        copper: {
          50:  "#fff7f0",
          100: "#ffe9d6",
          200: "#ffd0ad",
          300: "#ffb480",
          400: "#ef8f4f",
          500: "#d97735",
          600: "#b8632b",
          700: "#8f4c23",
          800: "#6f3c1d",
          900: "#532d16",
        }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
}