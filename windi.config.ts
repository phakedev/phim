import { defineConfig } from "windicss/helpers";
import colors from "windicss/colors";
import plugin from "windicss/plugin";

export default defineConfig({
  darkMode: "class",
  theme: {
    fontFamily: {
      sans: ["JetBrains Mono", "sans-serif"],
      mono: ["JetBrains Mono", "monospace"],
    },

    extend: {
      colors: {
        primary: colors.blue,
        gray: colors.trueGray,
      },
    },
  },

  shortcuts: {
    input: `
      border border-gray-200 input-shadow caret-pink-400 block w-full pl-12 pr-16 py-4 text-gray-700 rounded-md font-light text-center text-2xl transition
      hover:transition focus:outline-none focus:transition
      placeholder-gray-700 placeholder-opacity-50
      disabled:bg-gray-200
      disabled:cursor-not-allowed
      dark:placeholder-gray-500
      dark:text-white
      dark:bg-gray-800
      dark:border-transparent
      dark:transition
      dark:focus:ring-pink-900
    `,
  },

  plugins: [
    require("windicss/plugin/line-clamp"),
    plugin(({ addUtilities }) => {
      addUtilities({
        ".input-shadow": {
          "box-shadow": "0 2px 6px rgb(0 0 0 / 5%)",
        },
      });
    }),
  ],
});
