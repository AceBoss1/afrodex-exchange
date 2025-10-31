/** @type {import('postcss-load-config').Config} */
module.exports = {
  plugins: {
    // Tailwind CSS must be the first plugin
    tailwindcss: {},
    // Autoprefixer is necessary for cross-browser compatibility
    autoprefixer: {},
  },
}
