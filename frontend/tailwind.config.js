/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          nude: "hsl(var(--nude))",
          blush: "hsl(var(--blush))",
          espresso: "hsl(var(--espresso))",
          sand: "#E5D3C5",
          almond: "#D9C2B0",
          mocha: "#8D6E63",
          black: "#0E0E0E",
        }
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "sans-serif"]
      },
      boxShadow: {
        soft: "0 6px 24px -8px rgba(0,0,0,0.15)",
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 500ms ease-out both'
      }
    },
  },
  plugins: [],
}