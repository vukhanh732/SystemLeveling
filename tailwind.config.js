/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        "cyber-black": "#000814",
        "cyber-blue": {
          glow: "#00F0FF",
          light: "#50E5FF",
          dark: "#0080FF",
        },
        "cyber-green": {
          glow: "#39FF14",
          light: "#7FFF00",
          dark: "#32CD32",
        },
        "cyber-red": {
          glow: "#FF3131",
          light: "#FF5E5E",
          dark: "#C41E3A",
        },
        "cyber-purple": {
          glow: "#D550F9",
          light: "#E28FFA",
          dark: "#A020F0",
        },
      },
      boxShadow: {
        "neon-blue":
          "0 0 5px #00F0FF, 0 0 10px #00F0FF, 0 0 15px #00F0FF, 0 0 20px #00F0FF",
        "neon-blue-sm": "0 0 2px #00F0FF, 0 0 4px #00F0FF",
        "neon-green":
          "0 0 5px #39FF14, 0 0 10px #39FF14, 0 0 15px #39FF14, 0 0 20px #39FF14",
        "neon-green-sm": "0 0 2px #39FF14, 0 0 4px #39FF14",
        "neon-red":
          "0 0 5px #FF3131, 0 0 10px #FF3131, 0 0 15px #FF3131, 0 0 20px #FF3131",
        "neon-red-sm": "0 0 2px #FF3131, 0 0 4px #FF3131",
        "neon-purple":
          "0 0 5px #D550F9, 0 0 10px #D550F9, 0 0 15px #D550F9, 0 0 20px #D550F9",
        "neon-purple-sm": "0 0 2px #D550F9, 0 0 4px #D550F9",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 5px #00F0FF, 0 0 10px #00F0FF",
            opacity: 0.8,
          },
          "50%": {
            boxShadow:
              "0 0 10px #00F0FF, 0 0 20px #00F0FF, 0 0 30px #00F0FF",
            opacity: 1,
          },
        },
        flicker: {
          "0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%": {
            opacity: 0.99,
          },
          "20%, 21.999%, 63%, 63.999%, 65%, 69.999%": {
            opacity: 0.4,
          },
        },
        "circuit-flow": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "level-up": {
          "0%": { transform: "scale(1)", opacity: 0.5 },
          "50%": { transform: "scale(1.2)", opacity: 1 },
          "100%": { transform: "scale(1)", opacity: 0.5 },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 2s infinite",
        flicker: "flicker 3s linear infinite",
        "circuit-flow": "circuit-flow 8s linear infinite",
        "level-up": "level-up 2s ease-in-out",
        float: "float 3s ease-in-out infinite",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem",
        },
        screens: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
          "2xl": "1536px",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
