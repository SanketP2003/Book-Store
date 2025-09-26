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
        // Updated color palette based on UI specification
        primary: {
          light: '#10B981', // Emerald Green
          dark: '#34D399',  // Emerald Green (Dark Mode)
        },
        'primary-light': {
          DEFAULT: '#D1FAE5', // Soft Green
        },
        'primary-dark': {
          DEFAULT: '#065F46', // Deep Green
        },
        secondary: {
          light: '#1E40AF', // Deep Navy
          dark: '#60A5FA',  // Light Blue
        },
        accent: {
          light: '#F59E0B', // Amber
          dark: '#FBBF24',  // Amber Light
        },
        background: {
          light: '#FFFFFF', // White
          dark: '#121826',  // Dark Slate
        },
        surface: {
          light: '#F9FAFB', // Soft White
          dark: '#1E293B',  // Dark Blue-Gray
        },
        text_primary: {
          light: '#1F2937', // Dark Slate
          dark: '#F9FAFB',  // White
        },
        text_secondary: {
          light: '#6B7280', // Gray
          dark: '#9CA3AF',  // Light Gray
        },
        border: {
          light: '#E5E7EB', // Light Gray
          dark: '#374151',  // Dark Gray
        },
        error: {
          light: '#EF4444', // Red
          dark: '#F87171',  // Light Red
        },
        success: {
          light: '#22C55E', // Green
          dark: '#4ADE80',  // Light Green
        },
        warning: {
          light: '#F97316', // Orange
          dark: '#FB923C',  // Light Orange
        },
        info: {
          light: '#3B82F6', // Blue
          dark: '#60A5FA',  // Light Blue
        },
        // Extended green palette
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
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Literata', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        // Updated font size scale based on UI specification
        'display-lg': ['3rem', { lineHeight: '1.1', fontWeight: '700' }],      // 48px
        'display-md': ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],   // 36px
        'display-sm': ['1.875rem', { lineHeight: '1.2', fontWeight: '700' }],  // 30px
        'h1': ['1.5rem', { lineHeight: '1.3', fontWeight: '700' }],            // 24px
        'h2': ['1.25rem', { lineHeight: '1.3', fontWeight: '600' }],           // 20px
        'h3': ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }],          // 18px
        'body-lg': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],         // 16px
        'body-md': ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }],     // 14px
        'body-sm': ['0.75rem', { lineHeight: '1.5', fontWeight: '400' }],      // 12px
        'label': ['0.875rem', { lineHeight: '1.4', fontWeight: '500' }],       // 14px
        'button': ['0.875rem', { lineHeight: '1.4', fontWeight: '600' }],      // 14px
      },
      boxShadow: {
        // Updated shadow system based on UI specification
        'low': '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
        'medium': '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
        'high': '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
        'focus': '0 0 0 3px rgba(16,185,129,0.4)',
        'inner': 'inset 0 2px 4px rgba(0,0,0,0.06)',
        'glow': '0 0 15px rgba(16, 185, 129, 0.6)', // Green glow
        'glow-dark': '0 0 15px rgba(52, 211, 153, 0.6)', // Green glow for dark mode

        // Add missing soft shadow variants
        'soft': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'soft-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'soft-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'soft-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        // Updated border radius system based on UI specification
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        'full': '9999px',
      },
      spacing: {
        // Updated spacing system based on UI specification
        'xs': '0.25rem', // 4px
        'sm': '0.5rem',  // 8px
        'md': '1rem',    // 16px
        'lg': '1.5rem',  // 24px
        'xl': '2rem',    // 32px
        '2xl': '3rem',   // 48px
        '3xl': '4rem',   // 64px
        '4xl': '5rem',   // 80px
        '18': '4.5rem',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [],
}