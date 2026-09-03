/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0284c7', // Thủy - xanh nước sâu (hợp mệnh)
        primaryHover: '#0369a1',
        cta: '#f5b301', // Kim sinh Thủy - vàng kim (đổi từ cam Hỏa)
        ctaHover: '#d97706',
        ink: '#0b1220',
        gold: '#f5b301',
        surface: '#f1f5f9',
        sky: '#0ea5e9',
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', '"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Manrope"', '"Be Vietnam Pro"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,.06), 0 8px 24px -12px rgba(16,24,40,.25)',
        lift: '0 12px 32px -12px rgba(11,18,32,.35)',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        fadeUp: 'fadeUp .5s ease both',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}
