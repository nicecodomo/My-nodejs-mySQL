/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.ejs"],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'), // เพิ่ม DaisyUI
  ],
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },
}

