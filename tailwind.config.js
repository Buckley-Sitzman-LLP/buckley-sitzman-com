const colors = require("tailwindcss/colors")

module.exports = {
  content: [
    "_site/**/*.html",
    "_site/**/*.js",
  ],
  theme: {
    fontFamily: {
      sans: ["Inter var", "Helvetica", "Arial", "sans-serif"]
    },
    extend: {
      colors: {
        primary: {
          50: "#E9EAEC",
          100: "#D3D5D9",
          200: "#BDBFC6",
          300: "#A7AAB3",
          400: "#9295A0",
          500: "#7C808C",
          600: "#666B79",
          700: "#505566",
          800: "#3A4053",
          900: "#242B40"
        },
        secondary: {
          50: "#FDF7E8",
          100: "#FBEFD0",
          200: "#F7DFA1",
          300: "#F3D077",
          400: "#EFC048",
          500: "#EBB11A",
          600: "#C08F11",
          700: "#916C0D",
          800: "#5E4608",
          900: "#2F2304"
        },
        light_gold: {
          50: "#FFFCF5",
          100: "#FFF9EB",
          200: "#FFF3D6",
          300: "#FFEEC2",
          400: "#FFE8AD",
          500: "#FFE39B",
          600: "#FFCB47",
          700: "#F5AF00",
          800: "#A37500",
          900: "#523A00"
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
