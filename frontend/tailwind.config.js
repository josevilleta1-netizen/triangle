/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#f0f3fa",
        surface: "#f7f9ff",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f1f4fb",
        "surface-container": "#ebeef5",
        "surface-container-high": "#e5e8ef",
        "surface-container-highest": "#dfe2e9",
        primary: "#004ac6",
        "primary-container": "#2563eb",
        "on-primary": "#ffffff",
        secondary: "#565e74",
        "on-surface": "#0f172a",
        "on-surface-variant": "#64748b",
        outline: "#94a3b8",
        success: "#10b981",
        error: "#ef4444",
        warning: "#f59e0b",
      },
      borderRadius: {
        '2xl': '1.5rem',
        '3xl': '1.75rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'cloud-ambient': '0 10px 30px -5px rgba(15, 23, 42, 0.04), 0 4px 12px -2px rgba(15, 23, 42, 0.02)',
        'cloud-hover': '0 20px 40px -12px rgba(37, 99, 235, 0.16)',
        'cloud-modal': '0 25px 50px -12px rgba(15, 23, 42, 0.15)',
      }
    },
  },
  plugins: [],
}
