/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        console: {
          950: '#060B14',
          900: '#0B1220',
          850: '#0F1A2E',
          800: '#14213B',
          700: '#1C2E52',
          600: '#2A4375',
          500: '#3D5E9E',
        },
        cyber: {
          teal: '#00F2FE',
          cyan: '#06B6D4',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
          red: '#EF4444',
          crimson: '#DC2626',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
        'wave-bar': 'waveBar 1s ease-in-out infinite alternate',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 12px rgba(6, 182, 212, 0.6))' },
          '50%': { opacity: '0.6', filter: 'drop-shadow(0 0 4px rgba(6, 182, 212, 0.2))' },
        },
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        waveBar: {
          '0%': { height: '15%' },
          '100%': { height: '95%' },
        }
      }
    },
  },
  plugins: [],
}
