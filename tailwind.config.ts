import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        nova: {
          bg: "#0b0914",
          surface: "#140f26",
          card: "#191330",
          border: "#292048",
          borderHover: "#3e326b",
          muted: "#9b92b6",
          subtle: "#635b7f",
          accent: "#9d7bf5",
          accentHover: "#b094fa",
          plum: "#4c205c",
          coral: "#f7845f",
          gold: "#fdb750",
          lavender: "#7c6cf0",
        },
        prism: {
          50: "#f5f3ff",
          100: "#ede9fe",
          500: "#9d7bf5",
          600: "#8b5cf6",
          700: "#6d28d9",
          900: "#4c1d95",
        },
      },
    },
  },
  plugins: [],
};

export default config;
