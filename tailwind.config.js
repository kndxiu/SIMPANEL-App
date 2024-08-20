/** @type {import('tailwindcss').Config} */

export default {
  content: ["./src/index.html"],
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss"), require("autoprefixer")],
};
