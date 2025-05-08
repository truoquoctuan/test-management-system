/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#1C2B41',
          200: '#0C66E4',
        },
        text: {
          100: '#44546F',
          200: '#172B4D',
        },
        border: {
          100: '#091E4224',
        },
      },
      borderRadius: {
        default: '0.25rem',
      },
      screens: {
        md: { min: '1200px', max: '1650px' }, // Màn hình từ 1200px đến 1650px
        lg: { min: '1651px', max: '1920px' }, // Màn hình từ 1651px đến 1920px
      },
      boxShadow: {
        top: '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -2px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
