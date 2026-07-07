/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Enable 'class' dark mode for explicit control, especially useful for complex UIs
  darkMode: 'class', 
  theme: {
    extend: {
      // 1. Custom Fonts
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      // 2. Custom Colors (Based on our Sci-Fi theme)
      colors: {
        'deep-dark': '#050511', // Our main background
        'glass-light': 'rgba(255, 255, 255, 0.05)',
        'glass-dark': 'rgba(0, 0, 0, 0.2)',
        'indigo-glow': 'rgb(139, 92, 246)',
      },
      // 3. Custom Keyframes and Animations (Used for glow, fade-in, etc.)
      keyframes: {
        wavy: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-3px)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        wavy: 'wavy 1.2s infinite ease-in-out',
        'fade-in-up': 'fade-in-up 0.4s ease-out',
      },
      // 4. Custom Shadows (Deep and subtle for glass)
      boxShadow: {
        'glass-lift': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
        'neon-glow': '0 0 15px rgba(139, 92, 246, 0.8)',
      },
    },
  },
  plugins: [
    // This plugin is often required for custom utility classes and animations
    require('tailwindcss-animate'),
  ],
}