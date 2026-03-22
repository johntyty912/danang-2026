import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        danang: {
          deep: '#0077B6',
          sky: '#00B4D8',
          light: '#90E0EF',
          cream: '#CAF0F8',
          sand: '#F4A261',
        },
      },
    },
  },
  plugins: [],
};
export default config;
