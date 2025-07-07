const themeColors = require('./src/app/styles/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryCustom: themeColors.primary,
        secondaryCustom: themeColors.secondary,
        accent: themeColors.accent,
        background: {
          ...themeColors.background,
          DEFAULT: "var(--background)", // Optional nếu dùng CSS vars
        },
        neutral: themeColors.neutral,
        foreground: "var(--foreground)", // Nếu cần foreground riêng
      },
    },
  },
  plugins: [],
};
