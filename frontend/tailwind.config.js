const {
  iconsPlugin,
  getIconCollections,
} = require("@egoist/tailwindcss-icons");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", "./app/**/x*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui"),
    iconsPlugin({
      // Select the icon collections you want to use
      collections: getIconCollections(["mdi", "lucide"]),
    }),
  ],
};
