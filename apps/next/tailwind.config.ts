import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "../../node_modules/tailwind-datepicker-react/dist/**/*.js",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontFamily: {
      "satoshi": ["Satoshi-Medium", "sans-serif"],
      "satoshi-light": ["Satoshi-Light", "sans-serif"],
      "satoshi-bold": ["Satoshi-Black", "sans-serif"],
      sans: ['Inter', 'sans-serif'],
    },
    extend: {
      boxShadow: {
        't-sm': '0 -1px 2px 0 rgba(0, 0, 0, 0.05)',
        't-md': '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        't-lg': '0 -10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        't-xl': '0 -20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        't-2xl': '0 -25px 50px -12px rgba(0, 0, 0, 0.25)',
        't-3xl': '0 -35px 60px -15px rgba(0, 0, 0, 0.3)',
      },
      colors: {
        customIndigo: "hsl(var(--custom-indigo))",
        customIndigoDark: "hsl(var(--custom-indigo-dark))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        "exam-bg": "#F6F7F8",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "#FDEEEE",       // Very light red
          100: "#FBD5D5",      // Light red
          200: "#F8A3A3",      // Soft red
          400: "#E85C5C",      // True red
          500: "#D94242",      // Slightly deeper red
          600: "#B83232",      // Dark red
          700: "#992525",      // Deeper dark red
          800: "#7A1C1C",      // Very dark red
          900: "#5A1313",      // Nearly black red
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          100: "#EDEDED",      // Light gray
          200: "#D9D9D9",      // Softer gray
          400: "#7A7A7A",      // Neutral gray
          500: "#5A5A5A",      // Darker gray
          600: "#3F3F3F",      // Very dark gray
          700: "#262626"       // Nearly black
        },        
        gray: {
          10: "#FAFBFC",
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          400: "#9CA3AF",
          500: "#6B7280",
          700: "#50555E",
          900: "#111827",
        },
        green: {
          200: "#A7F3D0",
          600: "#059669",
        },
        red: {
          200: "#FECACA",
          600: "#DC2626",
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
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        border: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        border: 'border 4s ease infinite',
      },
      spacing: {
        'ellipse1-w': '750px',
        'ellipse1-h': '750px',
        'ellipse2-w': '1000px',
        'ellipse2-h': '1000px',
        'ellipse3-w': '1000px',
        'ellipse3-h': '750px',
      },
      inset: {
        'ellipse1-bottom': '-325px',
        'ellipse1-left': '-325px',
        'ellipse2-right': '-500px',
        'ellipse2-top': '-350px',
        'ellipse3-top': '5%',
        'ellipse3-left': '-500px',
      },
      transitionProperty: {
        'width': 'width',
      },
      backgroundImage: {
        'xp-background-gradient': 'linear-gradient(90deg, #F0B68E 0%, #F5883E 100%)',
        'level-background-gradient': 'linear-gradient(340deg, #E7772B 9.32%, #F5883E 83.24%)',
      },
      borderColor: {
        'level-border-color': '#F19B60',
      },
      screens: {
        "custom-sm": "768px",
        "custom-lg": "850px",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@assistant-ui/react/tailwindcss")
  ],
} satisfies Config;

export default config;
