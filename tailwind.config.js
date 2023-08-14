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
        base: {
          100: '#252525',
          200: '#858585',
        },
        link: '#266CD3',
        D0: '#D0D0D0',
        32: '#327DEC',
        F7: '#F7F8FA',
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
