import daisyui from "daisyui";
// import daisyUIThemes from "daisyui/src/theming/themes";
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],

  daisyui: {
    themes: [
      "dracula",
      "light",
      "dark",
      "black",
      // {
      //   light: {
      //     ...daisyUIThemes["light"],
      //     secondary: "rgb(230, 230, 230)",
      //   },
      // },
      // {
      //   dark: {
      //     ...daisyUIThemes["dark"],
      //     primary: "rgb(39, 55, 77)",
      //     secondary: "rgb(238, 238, 238)",
      //     base-300: "rgb(157, 178, 191)",
      //   },
      // },
      // {
      //   dracula: {
      //     ...daisyUIThemes["dracula"],
      //     secondary: "rgb(49, 49, 69)",
      //   },
      // },
      // {
      //   black: {
      //     ...daisyUIThemes["black"],
      //     primary: "rgb(200, 200, 200)",
      //     secondary: "rgb(30, 30, 30)",
      //   },
      // },
    ],
  },
};
