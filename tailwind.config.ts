import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Noto Serif SC", "Songti SC", "STSong", "SimSun", "serif"],
        ink: ["Noto Serif SC", "Songti SC", "STSong", "SimSun", "serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        // Ink-wash color palette - Traditional Chinese colors
        ink: {
          50: "#f5f5f5",
          100: "#d4d4d4",
          200: "#a3a3a3",
          300: "#888888",
          400: "#666666",
          500: "#525252",
          600: "#404040",
          700: "#262626",
          800: "#1a1a1a",
          900: "#0a0a0a",
        },
        // Rice paper colors (宣纸色)
        paper: {
          50: "#fdfcfa",
          100: "#f8f4e9",
          200: "#f5f0e1",
          300: "#eeebe4",
          400: "#e5e0d4",
          500: "#d4cfc2",
        },
        // Vermilion colors (朱砂色)
        vermilion: {
          50: "#fdedec",
          100: "#fadbd8",
          200: "#f5b7b1",
          300: "#f1948a",
          400: "#e74c3c",
          500: "#d35400",
          600: "#c23b22",
          700: "#b9452b",
          800: "#9c3d26",
          900: "#7c2d1a",
        },
        // Gold accent (金色)
        gold: {
          300: "#f0e68c",
          400: "#ffd700",
          500: "#daa520",
          600: "#b8860b",
        },
        // Jade accent (翠色)
        jade: {
          400: "#43a047",
          500: "#388e3c",
          600: "#2e7d32",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        ink: "0 1px 3px rgba(10, 10, 10, 0.08), 0 1px 2px rgba(10, 10, 10, 0.12)",
        "ink-lg": "0 4px 6px rgba(10, 10, 10, 0.05), 0 2px 4px rgba(10, 10, 10, 0.08)",
        "ink-xl": "0 10px 15px rgba(10, 10, 10, 0.05), 0 4px 6px rgba(10, 10, 10, 0.08)",
        "ink-bleed": "0 2px 8px rgba(10, 10, 10, 0.04), 0 4px 16px rgba(10, 10, 10, 0.02)",
      },
    },
  },
  plugins: [],
};
export default config;
