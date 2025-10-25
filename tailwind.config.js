/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/games/**/*.{js,jsx,ts,tsx}",
    "./src/core/**/*.{js,jsx,ts,tsx}",
    "./src/assets/**/*.{js,jsx,ts,tsx}",
    "./src/styles/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    // Добавляем классы для цветов призраков Pacman
    "bg-red-500",
    "bg-pink-50",
    "bg-cyan-500",
    "bg-orange-500",
    // Добавляем классы для других динамических цветов, если они используются
    "bg-gray-10",
    "bg-gray-800",
    "bg-gray-100",
    "bg-yellow-300",
    "bg-yellow-400",
    "bg-blue-600",
    "bg-red-600",
    "bg-green-600",
    "bg-yellow-500",
    "bg-red-600",
    "bg-gray-500",
  ],
};
