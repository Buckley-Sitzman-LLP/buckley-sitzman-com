const colors = require("tailwindcss/colors")

module.exports = {
  purge: [
    "_site/**/*.html",
    "_site/**/*.js",
  ],
  darkMode: false, // or "media" or "class"
  theme: {
    fontFamily: {
      sans: ["Inter var", "Helvetica", "Arial", "sans-serif"]
    },
    extend: {
      colors: {
        teal: colors.teal,
        cyan: colors.cyan,
        sky: colors.sky,
        blue: colors.blue,
        yellow: colors.yellow,
      },
      typography: {
        DEFAULT: {
          css: {
            blockquote: {
              "font-style": "normal",
              "quotes": "none"
            },
            h1: {
              "margin-bottom": "0rem",
            },
            a: {
              "text-decoration": "none",
              "&:hover": {
                "text-decoration": "underline"
              }
            },
          },
        }
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio")
  ],
}
