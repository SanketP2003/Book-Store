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
        // Enhanced color palette for more vibrant UI
        primary: {
          light: '#6D28D9', // Purple-700 (more vibrant than previous indigo)
          dark: '#8B5CF6',  // Purple-500
        },
        secondary: {
          light: '#0EA5E9', // Sky-600 (more vibrant blue)
          dark: '#38BDF8',  // Sky-400
        },
        accent: {
          light: '#F59E0B', // Amber-500 (new accent color)
          dark: '#FBBF24',  // Amber-400
        },
        highlight: {
          light: '#EC4899', // Pink-500 (new highlight color)
          dark: '#F472B6',  // Pink-400
        },
        background: {
          light: '#F8FAFC', // Slate-50 (slightly warmer)
          dark: '#0F172A',  // Slate-900 (richer dark mode)
        },
        surface: {
          light: '#FFFFFF', // White
          dark: '#1E293B',  // Slate-800 (slightly warmer dark surface)
        },
        text_primary: {
          light: '#1E293B', // Slate-800
          dark: '#F1F5F9',  // Slate-100
        },
        text_secondary: {
          light: '#64748B', // Slate-500
          dark: '#94A3B8',  // Slate-400
        },
        success: {
          light: '#16A34A', // Green-600
          dark: '#4ADE80',  // Green-400
        },
        error: {
          light: '#DC2626', // Red-600
          dark: '#F87171',  // Red-400
        },
        warning: {
          light: '#D97706', // Amber-600 (new warning color)
          dark: '#FBBF24',  // Amber-400
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'], // Adding a display font for headings
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'glow': '0 0 15px rgba(109, 40, 217, 0.5)',
        'glow-dark': '0 0 15px rgba(139, 92, 246, 0.5)',
      },
    },
  },
  plugins: [],
}