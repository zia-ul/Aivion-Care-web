import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        'xs': '320px',
        'sm': '375px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
      // Every colour resolves through a CSS variable defined in globals.css
      // (see the "[data-theme]" block) so light/dark swap without touching
      // call sites. Channels are space-separated so opacity modifiers such as
      // `bg-surface-20/75` keep working via the / <alpha-value> slot.
      colors: {
        primary: {
          light: 'rgb(var(--primary-light) / <alpha-value>)',
          50: 'rgb(var(--primary-50) / <alpha-value>)',
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
        },
        accent: 'rgb(var(--accent) / <alpha-value>)',
        'accent-deep': 'rgb(var(--accent-deep) / <alpha-value>)',
        'accent-soft': 'rgb(var(--accent-soft) / <alpha-value>)',
        // Foreground for text/icons sitting on top of an `bg-accent-fill` fill.
        'on-accent': 'rgb(var(--on-accent) / <alpha-value>)',
        // Deep variants used as solid button/badge backgrounds. The plain tokens
        // above stay light in the dark theme for text and icons; these carry a
        // white label so buttons never need dark text.
        'accent-fill': 'rgb(var(--accent-fill) / <alpha-value>)',
        'success-fill': 'rgb(var(--success-fill) / <alpha-value>)',
        'danger-fill': 'rgb(var(--danger-fill) / <alpha-value>)',
        'info-fill': 'rgb(var(--info-fill) / <alpha-value>)',
        surface: {
          10: 'rgb(var(--surface-10) / <alpha-value>)',
          20: 'rgb(var(--surface-20) / <alpha-value>)',
          30: 'rgb(var(--surface-30) / <alpha-value>)',
          40: 'rgb(var(--surface-40) / <alpha-value>)',
          50: 'rgb(var(--surface-50) / <alpha-value>)',
        },
        tonal: {
          0: 'rgb(var(--tonal-0) / <alpha-value>)',
          10: 'rgb(var(--tonal-10) / <alpha-value>)',
          20: 'rgb(var(--tonal-20) / <alpha-value>)',
          30: 'rgb(var(--tonal-30) / <alpha-value>)',
          40: 'rgb(var(--tonal-40) / <alpha-value>)',
          50: 'rgb(var(--tonal-50) / <alpha-value>)',
        },
        success: {
          DEFAULT: 'rgb(var(--success) / <alpha-value>)',
          light: 'rgb(var(--success-light) / <alpha-value>)',
          lighter: 'rgb(var(--success-lighter) / <alpha-value>)',
        },
        warning: {
          DEFAULT: 'rgb(var(--warning) / <alpha-value>)',
          light: 'rgb(var(--warning-light) / <alpha-value>)',
          lighter: 'rgb(var(--warning-lighter) / <alpha-value>)',
        },
        danger: {
          DEFAULT: 'rgb(var(--danger) / <alpha-value>)',
          light: 'rgb(var(--danger-light) / <alpha-value>)',
          lighter: 'rgb(var(--danger-lighter) / <alpha-value>)',
        },
        info: {
          DEFAULT: 'rgb(var(--info) / <alpha-value>)',
          light: 'rgb(var(--info-light) / <alpha-value>)',
          lighter: 'rgb(var(--info-lighter) / <alpha-value>)',
        },
        // Sky / teal palette matching aiconfidencecure.com
        sky: {
          50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 300: '#67e8f9',
          400: '#22d3ee', 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1',
          800: '#075985', 900: '#0c4a6a', 950: '#082f49',
        },
        teal: {
          50: '#f0fdfa', 100: '#ccfbf1', 200: '#99f6e4', 300: '#5eead4',
          400: '#2dd4bf', 500: '#14b8a6', 600: '#0d9488', 700: '#0f766e',
          800: '#115e59', 900: '#134e4a', 950: '#042f2a',
        },
        // Doctor-workspace palette, replacing hardcoded hex in components/doctor.
        doctor: {
          panel: 'rgb(var(--c-surface-a) / <alpha-value>)',
          raised: 'rgb(var(--c-surface-b) / <alpha-value>)',
          muted: 'rgb(var(--c-muted) / <alpha-value>)',
          dim: 'rgb(var(--c-dim) / <alpha-value>)',
          blue: 'rgb(var(--c-blue) / <alpha-value>)',
          lavender: 'rgb(var(--c-lavender) / <alpha-value>)',
          mint: 'rgb(var(--c-mint) / <alpha-value>)',
          gold: 'rgb(var(--c-gold) / <alpha-value>)',
          red: 'rgb(var(--c-red) / <alpha-value>)',
          pink: 'rgb(var(--c-pink) / <alpha-value>)',
          slate: 'rgb(var(--c-slate) / <alpha-value>)',
          // Solid-fill variants for doctor buttons: deep enough for a white label
          // in both themes, unlike the light `doctor-*` tints above.
          'blue-fill': 'rgb(var(--c-blue-fill) / <alpha-value>)',
          'lavender-fill': 'rgb(var(--c-lavender-fill) / <alpha-value>)',
          'mint-fill': 'rgb(var(--c-mint-fill) / <alpha-value>)',
          'gold-fill': 'rgb(var(--c-gold-fill) / <alpha-value>)',
          'red-fill': 'rgb(var(--c-red-fill) / <alpha-value>)',
          'pink-fill': 'rgb(var(--c-pink-fill) / <alpha-value>)',
          'slate-fill': 'rgb(var(--c-slate-fill) / <alpha-value>)',
          'danger-soft': 'rgb(var(--c-danger-soft) / <alpha-value>)',
          'border-soft': 'rgb(var(--c-border-soft) / <alpha-value>)',
          'border-input': 'rgb(var(--c-border-input) / <alpha-value>)',
          ink: 'rgb(var(--c-ink) / <alpha-value>)',
          shell: 'rgb(var(--c-shell) / <alpha-value>)',
          'shell-deep': 'rgb(var(--c-shell-deep) / <alpha-value>)',
          'shell-black': 'rgb(var(--c-shell-black) / <alpha-value>)',
          'rec-red': 'rgb(var(--c-rec-red) / <alpha-value>)',
        },
      },
      borderRadius: {
        'card': '24px',
        'input': '18px',
      },
      fontSize: {
        'support': '12px',
        'body': '15px',
        'heading': '20px',
        'section': ['22px', { lineHeight: '1.3' }],
        'subtitle': ['28px', { lineHeight: '1.2' }],
        'headline': ['34px', { lineHeight: '1.1' }],
      },
      boxShadow: {
        'soft': 'var(--shadow-soft)',
      },
      backgroundImage: {
        'gradient-bg': 'var(--gradient-bg)',
        'gradient-dark': 'var(--gradient-dark)',
      },
      maxWidth: {
        'container': '1200px',
      },
    },
  },
  plugins: [],
};

export default config;
