/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Core brand
        primary: {
          50: '#F0F1FF',
          100: '#E4E5FF',
          200: '#CBCDFF',
          300: '#A7A9FF',
          400: '#8083FB',
          500: '#635BFF',
          600: '#5548E8',
          700: '#4638C7',
          800: '#3A2FA0',
          900: '#312A7D',
        },
        accent: {
          purple: '#8B5CF6',
          purpleLight: '#EDE9FE',
          blue: '#3B82F6',
          blueLight: '#DBEAFE',
          green: '#10B981',
          greenLight: '#D1FAE5',
          orange: '#F59E0B',
          orangeLight: '#FEF3C7',
          red: '#EF4444',
          redLight: '#FEE2E2',
          teal: '#14B8A6',
          tealLight: '#CCFBF1',
        },
        ink: {
          900: '#0F1222',
          800: '#1A1D2E',
          700: '#2B2E42',
          600: '#4B4E63',
          500: '#6B6F87',
          400: '#9295AB',
          300: '#C2C4D6',
          200: '#E1E3EE',
          100: '#EEF0F8',
          50: '#F7F8FC',
        },
        surface: '#FFFFFF',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl2: '18px',
        xl3: '20px',
        xl4: '24px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(15, 18, 34, 0.04), 0 1px 2px rgba(15,18,34,0.04)',
        cardHover: '0 12px 32px rgba(15, 18, 34, 0.08), 0 2px 8px rgba(15,18,34,0.04)',
        premium: '0 8px 30px rgba(99, 91, 255, 0.12)',
        glow: '0 0 0 1px rgba(99,91,255,0.08), 0 8px 24px rgba(99,91,255,0.16)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #635BFF 0%, #8B5CF6 100%)',
        'gradient-mesh': 'radial-gradient(at 0% 0%, rgba(99,91,255,0.10) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(139,92,246,0.10) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(59,130,246,0.08) 0px, transparent 50%)',
        'gradient-hero-text': 'linear-gradient(90deg, #4338CA 0%, #8B5CF6 60%, #635BFF 100%)',
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'fade-up':    'fadeUp 0.6s ease forwards',
        'pulse-glow': 'pulseGlow 2.4s ease-out infinite',
        'shimmer':    'shimmerDown 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        fadeUp: {
          '0%':   { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(99,91,255,0.4)' },
          '70%':      { transform: 'scale(1)',    boxShadow: '0 0 0 10px rgba(99,91,255,0)' },
        },
        shimmerDown: {
          '0%':   { strokeDashoffset: '120', opacity: '0.4' },
          '50%':  { opacity: '1' },
          '100%': { strokeDashoffset: '0', opacity: '0.4' },
        },
      },
    },
  },
  plugins: [],
}
