// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // Pastikan path ini benar agar Tailwind memindai file src
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {
      // --- Palet Warna Vintage Minimalis ---
      colors: {
        'background-light': '#FBF8F1', 
        'background-card': '#FFFFFF', 
        'accent-vintage': {
          'DEFAULT': '#B5838D', 
          'dark': '#6D6875',  
        },
        'primary-brand': '#A47D4C', 
        'secondary-brand': '#4C6A4F', 
        'text-dark': '#2B2B2B',
      },
      // --- Tipografi Vintage ---
      fontFamily: {
         // 'Pacifico' untuk logo
        script: ['"Pacifico"', 'cursive'], 
        
        // 'Bellefair' untuk semua teks lainnya (UI & Judul)
        serif: ['"Bellefair"', 'serif'],
      },
    },
  },
  plugins: [],
}