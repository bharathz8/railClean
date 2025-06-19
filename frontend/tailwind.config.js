/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
      },
      colors: {
        primary: '#1E293B',       // Slate-800
        secondary: '#3B82F6',     // Blue-500
        accent: '#6366F1',        // Indigo-500
        info: '#38BDF8',          // Sky-400
        warning: '#FACC15',       // Yellow-400
        danger: '#EF4444',        // Red-500
        success: '#10B981',       // Green-500
        darkbg: '#0F172A',        // Dark background
        lightbg: '#F9FAFB',       // Light card/section
      },
    },
  },
  plugins: [],
};



