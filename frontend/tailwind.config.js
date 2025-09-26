/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // New green-focused color palette
        primary: {
          light: '#10B981', // Emerald-500
          dark: '#34D399',  // Emerald-400
        },
        secondary: {
          light: '#0EA5E9', // Sky-600 (blue accent)
          dark: '#38BDF8',  // Sky-400
        },
        accent: {
          light: '#F59E0B', // Amber-500 (warm accent)
          dark: '#FBBF24',  // Amber-400
        },
        highlight: {
          light: '#059669', // Emerald-600 (deeper green)
          dark: '#10B981',  // Emerald-500
        },
        background: {
          light: '#F9FAFB', // Gray-50 (subtle off-white)
          dark: '#111827',  // Gray-900 (rich dark mode)
        },
        surface: {
          light: '#FFFFFF', // White
          dark: '#1F2937',  // Gray-800
        },
        text_primary: {
          light: '#1F2937', // Gray-800
          dark: '#F9FAFB',  // Gray-50
        },
        text_secondary: {
          light: '#4B5563', // Gray-600
          dark: '#9CA3AF',  // Gray-400
        },
        success: {
          light: '#059669', // Emerald-600
          dark: '#10B981',  // Emerald-500
        },
        error: {
          light: '#DC2626', // Red-600
          dark: '#F87171',  // Red-400
        },
        // New shades of green for gradients and accents
        green: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'system-ui', 'sans-serif'],
        display: ['Lexend', 'Inter var', 'system-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
      boxShadow: {
        'soft': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'soft-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'soft-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'soft-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 15px rgba(16, 185, 129, 0.6)', // Green glow
        'glow-dark': '0 0 15px rgba(52, 211, 153, 0.6)', // Green glow for dark mode
      },
      borderRadius: {
        'sm': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      spacing: {
        '18': '4.5rem',
      },
      transitionDuration: {
        '400': '400ms',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}