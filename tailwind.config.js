import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        greenColor: "#26BBBA",
        backgroundGreen: "#ACDDD9",
        backgroundGray: "#E6E6E6",
        backgroundGray2: "#F0F0F0",
        backgroundCard: "#f5fefe",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        textPrimary: "#475467",
        textSecondary: "#a3aab3",
        textDarkBlue: "#2D3F7B",
        textGary: "#4d4d4d",
        buttonBackground: "#11daaa",
        buttonBackground2: "#369ca3",
        buttonBackground3: "#04838C",
        buttonBlue: "#1877F2",
        buttonLightGray: "#F1F4F5",
        highlight: "#00c3d1",
        borderGray: "#9b9b9b",
        borderGray2: "#999999",
        borderGreen: "#29a99e",
        headerGray: "#353535",
        headerGray2: "#707070",
        colorBlue: "#0FA2FE",
        colorRed: "#F02626",
        colorGreen: "#1ed0c1",
        colorCyan: "#04838C",
        textBlack: "#212121",
        buttonGreen: "#1EAEAE",
        backGroundCardGrayLight: "#FCFCFD",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
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
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
