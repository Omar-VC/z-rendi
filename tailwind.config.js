// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#280905",
        secondary: "#740A03",
        accent: "#C3110C",
        highlight: "#E6501B",
        grisSemiOscuro: "#242424",
        botonAlt1: "#A4E31B", 
      },
    },
  },
  plugins: [],
}
