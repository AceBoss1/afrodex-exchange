import type { Config } from 'tailwindcss';

const config: Config = {
  // CRITICAL: This content array tells Tailwind where to find the class names.
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Define your custom accent colors here for easy use
        'afro-primary': '#f59e0b', // A reference for the amber-500 we are using
        'afro-dark': '#0f172a',    // Deep slate blue for background
      },
    },
  },
  plugins: [],
};

export default config;
