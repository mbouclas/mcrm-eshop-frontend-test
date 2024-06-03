const plugin = require("tailwindcss/plugin")
import defaultTheme from 'tailwindcss/defaultTheme';
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ['Nunito', ...defaultTheme.fontFamily.sans],
      'nunito': ['"nunito", sans-serif'],

    },
    extend: {
      colors: {
        primary: "#FFC639",
        accent: "#790e1d",
        secondary: "#881226",
        info: "#F13D9E",
        sky: "#00a1df",
        dark: "#151515",
      },
      textShadow: {
        sm: "0 1px 2px var(--tw-shadow-color)",
        DEFAULT: "0 2px 4px var(--tw-shadow-color)",
        lg: "0 8px 16px var(--tw-shadow-color)",
      },
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
          {
            "text-shadow": (value) => ({
              textShadow: value,
            }),
          },
          { values: theme("textShadow") }
      )
    }),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/typography"),
  ],
}
