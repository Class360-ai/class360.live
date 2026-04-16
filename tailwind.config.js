/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        premium: '0 20px 60px -20px rgba(15, 23, 42, 0.24)',
        glow: '0 24px 80px -28px rgba(37, 99, 235, 0.45)',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Manrope', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-grid':
          'linear-gradient(rgba(59,130,246,.09) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,.09) 1px, transparent 1px)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: 0.55, transform: 'scale(1)' },
          '50%': { opacity: 0.9, transform: 'scale(1.05)' },
        },
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        glowPulse: 'glowPulse 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
