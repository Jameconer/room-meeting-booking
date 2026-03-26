
import colors from './tailwind.colors.json' assert { type: 'json' };

/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        bounceHorizontal: {
          '0%, 100%': { transform: 'translateX(-20px)' }, // เด้งซ้าย
          '50%': { transform: 'translateX(20px)' }, // เด้งขวา
        },
      },
      fontFamily: {
        leckerli: ["Leckerli One", "cursive"],
        dancing: ["Dancing Script", "cursive"],
      },
      animation: {
        'bounce-horizontal': 'bounceHorizontal 0.6s infinite', // ระยะเวลาและความถี่
      },
      screens: {
        'menuhide': '1025px', // ตั้งชื่อว่า menuhide ตามต้องการ 1050px
        'menuhideOn': '1028px', // ตั้งชื่อว่า menuhide ตามต้องการ 1070px
      },
      colors: {
        "green": "#43d443",
        "maincolor": "#5D7BA3"
      },
    },
  },
  plugins: [

  ]
};