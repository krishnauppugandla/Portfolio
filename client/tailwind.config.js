/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        background: '#FFFFFF',
        'background-alt': '#F8F8F8',
        black: '#0A0A0A',
        ink: '#1C1C1E',
        muted: '#6B6B6B',
        light: '#A8A8A8',
        border: '#EBEBEB',
        blue: {
          DEFAULT: '#2563EB',
          bg: '#EFF6FF',
        },
        green: {
          DEFAULT: '#059669',
          bg: '#ECFDF5',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'count-up': 'countUp 1s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
};
