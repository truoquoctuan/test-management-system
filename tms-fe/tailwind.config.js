const defaultTheme = require('tailwindcss/defaultTheme');
/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
    content: ['./src/**/*.{html,js,jsx}'],
    theme: {
        extend: {
            colors: {
                primary: {
                    1: '#0066CC',
                    2: '#EDF3FF'
                },
                neutral: {
                    1: '#121212',
                    2: '#484848',
                    3: '#787878',
                    4: '#B3B3B3',
                    5: '#DEDEDE',
                    6: '#E8E8E8',
                    7: '#F4F4F4'
                },
                state: {
                    error: '#FF6060',
                    warning: '#F1AD00',
                    information: '#1D79ED',
                    success: '#2A9C58',
                    untested: '#979797',
                    bg: '#F8F8F8'
                }
            },
            keyframes: {
                loading: {
                    '0%': { backgroundPositionX: '120%' },
                    '100%': { backgroundPositionX: '-20%' }
                }
            },
            animation: {
                loading: '1s loading ease-in-out infinite'
            },
            backgroundImage: {
                loader: 'linear-gradient(100deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0) 60%)'
            },
            backgroundSize: {
                '200%': '200% 100%'
            }
        },
        screens: {
            xs: { max: '374px' },
            // => @media (max-width: 374px) { ... }
            s: { min: '375px', max: '575px' },
            // => @media (min-width: 375px and max width: 575px ) { ... }
            sm: { min: '576px', max: '767px' },
            // => @media (min-width: 576px and max width: 767px ) { ... }
            md: { min: '768px', max: '1023px' },
            // => @media (min-width: 768px and max width: 1023px ) { ... }
            lg: { min: '1024px', max: '1279px' },
            // => @media (min-width: 1024px and max-width: 1279px) { ... }
            xl: { min: '1280px', max: '1440px' },
            // => @media (min-width: 1280px and max-width: 1440px) { ... }
            ...defaultTheme.screens
        }
    },
    plugins: []
};
