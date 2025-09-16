/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6", // blue
        accent: "#f59e0b",  // amber
        success: "#22c55e", // green
        danger: "#ef4444",  // red
      },
    },
  },
  plugins: [],
}
