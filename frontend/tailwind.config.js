/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        concrete: "#D9DDE0", // fondo
        steel: "#C9CED2",    // dial exterior
        plate: "#E8EBED",    // superficies claras
        line: "#B9BFC4",     // bordes y divisiones
        ink: "#22282E",      // texto y superficie oscura
        muted: "#4A535B",    // texto secundario
        mist: "#AEB6BD",     // texto secundario sobre ink
        teal: { DEFAULT: "#1F6F6A", dark: "#174F4B" },
        brass: { DEFAULT: "#C9963A", light: "#D9A94F" },
        alert: "#A63A2B",
      },
      fontFamily: {
        sans: ["Archivo", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
