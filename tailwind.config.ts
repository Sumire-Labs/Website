import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        foreground: "#fafafa",
        muted: "#171717",
        "muted-foreground": "#a3a3a3",
        accent: "#262626",
      },
      borderColor: {
        glass: "rgba(255, 255, 255, 0.1)",
      },
      backgroundColor: {
        glass: "rgba(255, 255, 255, 0.05)",
        "glass-hover": "rgba(255, 255, 255, 0.1)",
      },
      backdropBlur: {
        glass: "20px",
      },
    },
  },
  plugins: [],
};

export default config;
