/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        aura: {
          50: "#faf8f5",
          100: "#f4f0e8",
          200: "#e7decb",
          300: "#d7c7aa",
          400: "#c4aa84",
          500: "#ad8d62",
          600: "#94734e",
          700: "#75583e",
          800: "#5c4633",
          900: "#443427",
        },
        botanic: {
          50: "#f2f7f4",
          100: "#e1ede5",
          200: "#c4dcce",
          300: "#9bc2ac",
          400: "#6fa487",
          500: "#4d8767",
          600: "#3b6d51",
          700: "#305742",
          800: "#274636",
          900: "#1a2e24",
        },
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["'Plus Jakarta Sans'", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'card': '0 10px 30px -5px rgba(0, 0, 0, 0.07), 0 4px 10px -2px rgba(0, 0, 0, 0.03)',
        'elevated': '0 20px 40px -10px rgba(0, 0, 0, 0.12), 0 8px 16px -4px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}
