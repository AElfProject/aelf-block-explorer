/*
 * @Author: aelf-lxy
 * @Date: 2023-08-02 01:50:01
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-18 11:18:49
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
        D0: '#D0D0D0',
        32: '#327DEC',
        F7: '#F7F8FA',
        'color-divider': '#E6E6E6',
        confirm: '#05BD72',
        'confirm-br': '#BCE1D8',
        'confirm-bg': '#EAF5F3',
        ECEEF2: '#ECEEF2',
        button_active: '#155ABF',
        pink_stroke: '#FFD0D0',
        pink_fill: '#FFEDED',
      },
      boxShadow: {
        table: '0px 8px 16px 0px rgba(0, 0, 0, 0.04)',
        search: '0px 6px 24px 0px rgba(0, 0, 0, 0.24)',
        row_tab: '0px -2px 0px 0px #266CD3',
        row_tab_inset: '0px -2px 0px 0px #266CD3 inset',
        title_bot: '0px -1px 0px 0px #E6E6E6 inset',
      },
      lineHeight: {
        20: '20px',
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
