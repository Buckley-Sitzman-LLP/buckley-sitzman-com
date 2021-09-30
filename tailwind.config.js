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
      colors: {
        arid_red: {
          50: "#FBF4F4",
          100: "#F6EAEA",
          200: "#E9CACA",
          300: "#DBA9A9",
          400: "#C16969",
          500: "#A62929",
          600: "#952525",
          700: "#641919",
          800: "#4B1212",
          900: "#320C0C"
        },
        arid_orange: {
          50: "#FCF6F3",
          100: "#F9EEE7",
          200: "#EFD4C4",
          300: "#E5BAA0",
          400: "#D28659",
          500: "#BF5212",
          600: "#AC4A10",
          700: "#73310B",
          800: "#562508",
          900: "#391905",
        },
        arid_darkgreen: "#173d40",
      }
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
