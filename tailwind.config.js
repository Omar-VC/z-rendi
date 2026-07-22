// tailwind.config.js

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        background: "#EAEFEF",

        surface: "#FFFFFF",

        primary: "#25343F",

        secondary: "#BFC9D1",

        accent: "#FF9B51",

        success: "#22C55E",

        warning: "#FACC15",

        danger: "#EF4444",
      },

      borderRadius: {
        xl: "14px",
        "2xl": "18px",
      },

      boxShadow: {
        card: "0 4px 14px rgba(37,52,63,.08)",
        cardHover: "0 8px 24px rgba(37,52,63,.12)",
      },
    },
  },

  plugins: [],
};