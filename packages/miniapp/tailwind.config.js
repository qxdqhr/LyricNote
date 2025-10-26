/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#5B8AFF',
        secondary: '#FF6B9D',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // 小程序不需要重置样式
  },
}
