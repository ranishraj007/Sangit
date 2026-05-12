/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#050507",
        panel: "rgba(20, 21, 27, 0.72)",
        line: "rgba(255, 255, 255, 0.10)",
        pulse: "#1ed760",
        violet: "#9b5cff",
      },
      boxShadow: {
        glow: "0 0 32px rgba(30, 215, 96, 0.18)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
