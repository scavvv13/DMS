/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryLight: " #8cb6ff", // Example lighter shade
      },
    },
  },
  daisyui: {
    themes: ["light", "dark", "corporate", "cupcake", "pastel"],
  },
  plugins: [require("daisyui")],
};
