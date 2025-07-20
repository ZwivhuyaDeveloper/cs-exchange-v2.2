module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Adjust paths to match your project structure
    "./app/globals.css",
    './node_modules/recharts/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))",
      },
    },
  },
  plugins: [],
};