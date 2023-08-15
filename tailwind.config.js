/*
 * @Author: aelf-lxy
 * @Date: 2023-08-02 01:50:01
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-04 17:53:31
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
        'global-grey': '#f7f8f9',
        base: {
          100: '#252525',
          200: '#858585',
        },
        link: '#266CD3',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
