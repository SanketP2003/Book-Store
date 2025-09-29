/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // class-based dark mode
  theme: {
    extend: {
      colors: {
        // Map app colors to CSS variables to avoid hardcoded colors
        primary: {
          light: 'var(--accent-primary)',
          dark: 'var(--accent-primary)',
        },
        'primary-light': {
          DEFAULT: 'var(--accent-primary)',
        },
        'primary-dark': {
          DEFAULT: 'var(--accent-primary)',
        },
        secondary: {
          light: 'var(--bg-secondary)',
          dark: 'var(--bg-secondary)',
        },
        accent: {
          light: 'var(--accent-primary)',
          dark: 'var(--accent-primary)',
        },
        background: {
          light: 'var(--bg-primary)',
          dark: 'var(--bg-primary)',
        },
        surface: {
          light: 'var(--card-bg)',
          dark: 'var(--card-bg)',
        },
        text_primary: {
          light: 'var(--text-primary)',
          dark: 'var(--text-primary)',
        },
        text_secondary: {
          light: 'var(--text-secondary)',
          dark: 'var(--text-secondary)',
        },
        border: {
          light: 'var(--card-border)',
          dark: 'var(--card-border)',
        },
        error: {
          light: 'var(--error)',
          dark: 'var(--error)',
        },
        success: {
          light: 'var(--success)',
          dark: 'var(--success)',
        },
        warning: {
          light: 'var(--warning)',
          dark: 'var(--warning)',
        },
        info: {
          light: 'var(--accent-primary)',
          dark: 'var(--accent-primary)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Literata', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display-lg': ['3rem', { lineHeight: '1.1', fontWeight: '700' }],
        'display-md': ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],
        'display-sm': ['1.875rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h1': ['1.5rem', { lineHeight: '1.3', fontWeight: '700' }],
        'h2': ['1.25rem', { lineHeight: '1.3', fontWeight: '600' }],
        'h3': ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['0.75rem', { lineHeight: '1.5', fontWeight: '400' }],
        'label': ['0.875rem', { lineHeight: '1.4', fontWeight: '500' }],
        'button': ['0.875rem', { lineHeight: '1.4', fontWeight: '600' }],
      },
      boxShadow: {
        'low': '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
        'medium': '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
        'high': '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
        'focus': '0 0 0 3px rgba(124,58,237,0.45)', // match purple focus by default
        'inner': 'inset 0 2px 4px rgba(0,0,0,0.06)',
        'glow': '0 0 15px rgba(124, 58, 237, 0.5)',
        'glow-dark': '0 0 15px rgba(139, 92, 246, 0.5)',
        'soft': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'soft-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'soft-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'soft-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        'full': '9999px',
      },
      spacing: {
        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
        '4xl': '5rem',
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