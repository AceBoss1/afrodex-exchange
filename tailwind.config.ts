import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        orange: '#ff8c2b',
        panel: '#141419',
        bg: '#0b0b0f',
      },
    },
  },
  plugins: [],
}

export default config