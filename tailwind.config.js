module.exports = {
  purge: {
    mode: "all",
    content: [
      "./**/*.html",
      "./**/*.css",
      "./**/*.js",
    ],
    options: {
      whitelist: [],
    },
  },
  theme: {},
  variants: {},
  plugins: [require("@tailwindcss/typography")],
};
