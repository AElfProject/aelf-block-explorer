/*
 * @Author: aelf-lxy
 * @Date: 2023-08-02 01:50:01
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-15 17:14:30
 * @Description: tailwind config
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'main-blue': '#1D2A51',
        'rise-red': '#FF4D4F',
        'fall-green': '#05bd72',
        base: {
          100: '#252525',
          200: '#858585',
        },
        link: '#266CD3',
        D0: '#D0D0D0',
        32: '#327DEC',
        F7: '#F7F8FA',
        'color-divider': '#E6E6E6',
      },
      boxShadow: {
        table: '0px 8px 16px 0px rgba(0, 0, 0, 0.04)',
      },
      lineHeight: {
        22: '1.375rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
