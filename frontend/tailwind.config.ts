import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "display-1": ["6rem", { lineHeight: "1", letterSpacing: "-0.03em", fontWeight: "800" }],
        "display-2": ["4.5rem", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "700" }],
        "display-3": ["3.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-4": ["2.5rem", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "600" }],
        "heading-1": ["2rem", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "600" }],
        "heading-2": ["1.5rem", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" }],
        "heading-3": ["1.25rem", { lineHeight: "1.4", letterSpacing: "-0.01em", fontWeight: "600" }],
        "body-base": ["1rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.6" }],
        "meta": ["0.75rem", { lineHeight: "1.5", letterSpacing: "0.02em" }],
      },
      colors: {
        surface: {
          DEFAULT: "#0a0a0f",
          light: "#12121a",
          card: "rgba(255,255,255,0.04)",
          border: "rgba(255,255,255,0.06)",
          hover: "rgba(255,255,255,0.08)",
        },
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        accent: {
          purple: "#c084fc",
          pink: "#f472b6",
          blue: "#60a5fa",
          green: "#34d399",
        },
      },
      boxShadow: {
        glow: "0 0 30px rgba(99,102,241,0.15)",
        "glow-lg": "0 0 60px rgba(99,102,241,0.2)",
        brutal: "6px 6px 0px rgba(99,102,241,0.3)",
        "brutal-lg": "8px 8px 0px rgba(99,102,241,0.3)",
      },
      borderWidth: {
        "3": "3px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-brand": "linear-gradient(135deg, #818cf8, #c084fc, #f472b6)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 3s ease-in-out infinite",
        "gradient-rotate": "gradient-rotate 4s linear infinite",
        "type-reveal": "type-reveal 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards",
        glitch: "glitch 0.3s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "gradient-rotate": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "type-reveal": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glitch: {
          "0%": { transform: "translate(-2px, 2px)" },
          "100%": { transform: "translate(2px, -2px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
