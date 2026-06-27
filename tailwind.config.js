/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parkwise: {
          bg: '#06110b',
          card: '#0f1f17',
          cardHover: '#132a1e',
          primary: '#22c55e',
          primaryHover: '#16a34a',
          accent: '#4ade80',
          accentHover: '#22c55e',
          textMuted: '#94a3b8',
          textLight: '#f8fafc',
          yellow: '#ffd700',
          yellowHover: '#ffc107',
        }
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'parkey-float': 'parkeyFloat 3s ease-in-out infinite',
        'parkey-pulse': 'parkeyPulse 3.2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        parkeyFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        parkeyPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.55' },
          '50%': { transform: 'scale(1.03)', opacity: '0.95' },
        }
      }
    },
  },
  plugins: [],
}
