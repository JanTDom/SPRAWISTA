import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/presentation/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: "#F6F5F1",
          subtle: "#EFECE6",
        },
        paper: {
          DEFAULT: "#FFFFFF",
          muted: "#FAF9F6",
        },
        ink: {
          DEFAULT: "#172338",
          secondary: "#5F6774",
          tertiary: "#8C93A0",
          border: "#E1E3E7",
        },
        cobalt: {
          DEFAULT: "#355CFF",
          hover: "#2849D9",
          subtle: "#EEF2FF",
          border: "#C7D2FE",
        },
        status: {
          verified: "#137333",
          "verified-bg": "#E6F4EA",
          warning: "#B06000",
          "warning-bg": "#FEF7E0",
          critical: "#C5221F",
          "critical-bg": "#FCE8E6",
          citation: "#1A73E8",
          "citation-bg": "#E8F0FE",
        },
      },
      fontFamily: {
        serif: ["var(--font-newsreader)", "Newsreader", "Georgia", "serif"],
        sans: ["var(--font-manrope)", "Manrope", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "SF Mono", "Menlo", "monospace"],
      },
      boxShadow: {
        paper: "0 1px 3px rgba(23, 35, 56, 0.05), 0 8px 24px rgba(23, 35, 56, 0.04)",
        "paper-elevated": "0 4px 6px -1px rgba(23, 35, 56, 0.07), 0 16px 32px -4px rgba(23, 35, 56, 0.08)",
        dock: "0 -2px 12px rgba(23, 35, 56, 0.04), 0 1px 3px rgba(23, 35, 56, 0.05)",
      },
      maxWidth: {
        prose: "68ch",
      },
    },
  },
  plugins: [],
};

export default config;
