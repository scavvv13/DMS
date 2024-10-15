/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
<<<<<<< HEAD
    extend: {
      colors: {
        primaryLight: " #8cb6ff", // Example lighter shade
      },
    },
=======
    extend: {},
>>>>>>> 280fd07ea44cf9dc5c7c2959b4fe093e9708273e
  },
  daisyui: {
    themes: ["light", "dark", "corporate", "cupcake", "pastel"],
  },
  plugins: [require("daisyui")],
};
