import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      fontSize: {
        xs: ["0.875rem", { lineHeight: "1.25rem" }],      // 14px 
        sm: ["0.9375rem", { lineHeight: "1.375rem" }],   // 15px
        base: ["1rem", { lineHeight: "1.5rem" }],         // 16px
        lg: ["1.125rem", { lineHeight: "1.75rem" }],      // 18px
        xl: ["1.25rem", { lineHeight: "1.75rem" }],       // 20px
        "2xl": ["1.5rem", { lineHeight: "2rem" }],        // 24px
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],   // 30px
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],     // 36px 
      },
      colors: {
        /* Standard HSL mapping for Shadcn primitives */
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },

        /* Semantic Design Tokens (mapped to src/styles/design-tokens.css) */
        brand: {
          DEFAULT: "var(--fm-brand-plum)",
          plum: "var(--fm-brand-plum)",
          dark: "var(--fm-brand-plum-dark)",
          light: "var(--fm-brand-plum-light)",
          soft: "var(--fm-brand-soft)",
          cream: "var(--fm-brand-cream)",
          heading: "var(--fm-brand-heading)",
          muted: "var(--fm-brand-muted)",
          border: "var(--fm-border-default)",
          /* Domain status */
          lost: "var(--fm-lost)",
          lostBg: "var(--fm-lost-subtle)",
          lostBorder: "var(--fm-lost-border)",
          found: "var(--fm-found)",
          foundBg: "var(--fm-found-subtle)",
          foundBorder: "var(--fm-found-border)",
        },

        /* Domain & semantic aliases */
        lost: {
          DEFAULT: "var(--fm-lost)",
          subtle: "var(--fm-lost-subtle)",
          border: "var(--fm-lost-border)",
          hover: "var(--fm-lost-hover)",
        },
        found: {
          DEFAULT: "var(--fm-found)",
          subtle: "var(--fm-found-subtle)",
          border: "var(--fm-found-border)",
          hover: "var(--fm-found-hover)",
        },
        surface: {
          page: "var(--fm-surface-page)",
          card: "var(--fm-surface-card)",
          muted: "var(--fm-surface-muted)",
          popover: "var(--fm-surface-popover)",
          overlay: "var(--fm-surface-overlay)",
        },
        content: {
          primary: "var(--fm-content-primary)",
          secondary: "var(--fm-content-secondary)",
          muted: "var(--fm-content-muted)",
          brand: "var(--fm-content-brand)",
          inverse: "var(--fm-content-inverse)",
        },
      },
      borderRadius: {
        xs: "var(--fm-radius-xs)",
        sm: "var(--fm-radius-sm)",
        md: "var(--fm-radius-md)",
        lg: "var(--fm-radius-lg)",
        xl: "var(--fm-radius-xl)",
        "2xl": "var(--fm-radius-2xl)",
        pill: "var(--fm-radius-pill)",
      },
      boxShadow: {
        "fm-card": "0 4px 20px -2px rgba(91, 14, 45, 0.05)",
        "fm-popover": "0 10px 30px -4px rgba(42, 27, 23, 0.08)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Geologica", "Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
