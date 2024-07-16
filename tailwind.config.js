/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
            'fade-in-up': 'fadeInUp 0.5s ease-out',
            'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fly: {
          '0%': { transform: 'translate(0, 0)', opacity: '1' },
          '100%': { transform: 'translate(var(--fly-x), var(--fly-y))', opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        'fade-in': {
          '0%': {
            opacity: '0'
          },
          '100%': {
            opacity: '1'
          },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        fly: 'fly 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-down': 'fade-in-down 0.5s ease-out',
        'fade-in': 'fade-in 0.5s ease-out'
      },
    },
  },
  variants: {
    extend: {
      scale: ['group-hover'],
      opacity: ['group-hover'],
    },
  },
  plugins: [],
};