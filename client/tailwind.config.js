import typography from "@tailwindcss/typography";
import scrollbar from "tailwind-scrollbar";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        "surface-soft": "var(--color-surface-soft)",
        border: "var(--color-border)",
        primary: {
          DEFAULT: "var(--color-primary)",
          dark: "var(--color-primary-dark)",
          light: "var(--color-primary-light)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          soft: "var(--color-accent-soft)",
        },
        text: {
          primary: "var(--color-text-primary)",
          muted: "var(--color-text-muted)",
          light: "var(--color-text-light)",
        },
        success: "var(--color-success)",
        error: "var(--color-error)",
        warning: "var(--color-warning)",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "serif"],
        sans: ["DM Sans", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
      fontSize: {
        "display-2xl": "clamp(3rem, 8vw, 6rem)",
        "display-xl": "clamp(2.25rem, 5vw, 4rem)",
        "display-lg": "clamp(1.75rem, 3.5vw, 2.75rem)",
        "display-md": "clamp(1.375rem, 2.5vw, 1.875rem)",
        "body-lg": "1.125rem",
        "body-md": "1rem",
        "body-sm": "0.875rem",
        label: "0.75rem",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        pill: "var(--radius-pill)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        card: "var(--shadow-card)",
        hover: "var(--shadow-hover)",
      },
    },
  },
  plugins: [scrollbar, typography],
};
