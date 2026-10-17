/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        plum: {
          DEFAULT: '#5B2A4E',
          deep: '#3E1A36',
        },
        lavender: {
          DEFAULT: '#B9A3D6',
        },
        lilac: {
          soft: '#E4D7F2',
        },
        blush: {
          DEFAULT: '#F4C6D7',
          soft: '#FBE6EE',
        },
        peach: {
          DEFAULT: '#F7D4B5',
        },
        cream: {
          DEFAULT: '#FFF8F3',
        },
        gold: {
          DEFAULT: '#C9A24B',
          soft: '#E3C98A',
          text: '#8A6414',
        },
      },
      fontFamily: {
        script: ['var(--font-script)', '"Snell Roundhand"', '"Apple Chancery"', 'Georgia', 'serif'],
        display: ['var(--font-display)', 'Georgia', '"Times New Roman"', 'serif'],
        label: ['var(--font-label)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'Georgia', 'serif'],
        serif: ['var(--font-body)', 'Georgia', 'serif'],
        arabic: ['var(--font-arabic)', '"Traditional Arabic"', 'serif'],
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'glow-flicker': 'lanternFlicker 3s ease-in-out infinite',
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.9', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' },
        },
        lanternFlicker: {
          '0%, 100%': { opacity: '0.88', filter: 'drop-shadow(0 0 15px rgba(201,162,75,0.45))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 28px rgba(227,201,138,0.8))' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(6px)' },
        },
      },
    },
  },
  plugins: [],
};
