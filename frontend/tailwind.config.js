import daisyui from 'daisyui'
import daisyuiUiTheme from 'daisyui/src/theming/themes'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui,],
   daisyui: {
    themes: [
      "light",
      {
        black: {
          ...daisyuiUiTheme["black"],
          primary: "rgb(29,155,240)",
          secondary: "rgb(24,24,24)",
        },
      },
    ],
  },
}

