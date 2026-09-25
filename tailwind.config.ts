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
      colors: {
        primary: {
          light: '#DDFBF8',
          50: '#E8FFFC',
          DEFAULT: '#22D3C5',
        },
        accent: '#22D3C5',
        surface: {
          10: '#07141D',
          20: '#0D202B',
          30: '#143342',
          40: '#1A4654',
          50: '#2A6170',
        },
        tonal: {
          0: '#102A36',
          10: '#123A49',
          20: '#1A4654',
          30: '#276172',
          40: '#458494',
          50: '#76AAB4',
        },
        success: {
          DEFAULT: '#21D6A5',
          light: '#6AF0C9',
          lighter: '#B7F9E8',
        },
        warning: {
          DEFAULT: '#A87828',
          light: '#F2C66D',
          lighter: '#FFE9AE',
        },
        danger: {
          DEFAULT: '#A83B55',
          light: '#F47D8A',
          lighter: '#FFC1C8',
        },
        info: {
          DEFAULT: '#315BD4',
          light: '#6E96FF',
          lighter: '#C0D0FF',
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
        'soft': '0 16px 28px rgba(0,0,0,0.28)',
      },
      backgroundImage: {
        'gradient-bg': 'linear-gradient(145deg, #07141D 0%, #0C2430 55%, #07141D 100%)',
        'gradient-dark': 'linear-gradient(145deg, #03090F 0%, #0A1B26 58%, #06151E 100%)',
      },
      maxWidth: {
        'container': '1200px',
      },
    },
  },
  plugins: [],
};

export default config;
