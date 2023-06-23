/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", "./app/**/x*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
