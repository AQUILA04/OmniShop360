/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2F7EDA',
          hover: '#1A5FB4',
          light: '#EBF3FC',
          container: '#2075D0',
        },
        success: {
          DEFAULT: '#51BC8F',
          light: '#E8F8F0',
        },
        warning: {
          DEFAULT: '#FCA103',
          light: '#FFF5E0',
        },
        error: {
          DEFAULT: '#D93E3E',
          light: '#FDECEC',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          'container-lowest': '#FFFFFF',
          'container-low': '#F4F2FF',
          'container': '#F0EEF8',
          dim: '#D9D9E8',
        },
        background: '#FBF8FF',
        border: {
          DEFAULT: '#C6D1D7',
          ghost: 'rgba(198, 209, 215, 0.2)',
        },
        text: {
          primary: '#555663',
          secondary: '#676C73',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        display: ['48px', { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '700' }],
        h1: ['32px', { lineHeight: '40px', letterSpacing: '-0.02em', fontWeight: '600' }],
        h2: ['24px', { lineHeight: '32px', fontWeight: '500' }],
        h3: ['20px', { lineHeight: '28px', fontWeight: '500' }],
        body: ['16px', { lineHeight: '24px', fontWeight: '400' }],
        small: ['14px', { lineHeight: '20px', fontWeight: '500' }],
        caption: ['12px', { lineHeight: '16px', fontWeight: '400' }],
      },
      spacing: {
        'space-1': '4px',
        'space-2': '8px',
        'space-3': '12px',
        'space-4': '16px',
        'space-5': '20px',
        'space-6': '24px',
        'space-8': '32px',
        'space-10': '40px',
        'space-12': '48px',
        'space-16': '64px',
      },
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        full: '9999px',
      },
      boxShadow: {
        'ambient': '0 20px 40px rgba(25, 27, 38, 0.05)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.06)',
        'header': '0 2px 4px rgba(0, 0, 0, 0.04)',
        'modal': '0 25px 50px -12px rgba(25, 27, 38, 0.25)',
        'floating': '0 10px 40px rgba(25, 27, 38, 0.08)',
      },
      backdropBlur: {
        glass: '20px',
      },
      minHeight: {
        'touch': '60px',
      },
      transitionDuration: {
        fast: '100ms',
        base: '200ms',
        slow: '300ms',
        spring: '400ms',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}
