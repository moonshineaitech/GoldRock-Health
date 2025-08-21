import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        // Medical-specific color palette
        'medical-blue': 'var(--medical-blue)',
        'medical-purple': 'var(--medical-purple)',
        'medical-teal': 'var(--medical-teal)',
        'medical-emerald': 'var(--medical-emerald)',
        'medical-amber': 'var(--medical-amber)',
        'medical-rose': 'var(--medical-rose)',
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "Menlo", "Monaco", "monospace"],
        medical: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      backdropBlur: {
        'xs': '2px',
        'medical': '8px',
      },
      backdropBrightness: {
        25: '.25',
        175: '1.75',
      },
      backdropSaturate: {
        25: '.25',
        175: '1.75',
      },
      boxShadow: {
        'medical': 'var(--shadow-md)',
        'medical-lg': 'var(--shadow-lg)',
        'medical-xl': 'var(--shadow-xl)',
        'medical-2xl': 'var(--shadow-2xl)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-lg': '0 15px 35px 0 rgba(31, 38, 135, 0.4)',
      },
      gradientColorStops: {
        'medical-start': '#1e40af',
        'medical-middle': '#7c3aed', 
        'medical-end': '#059669',
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-in-out",
        "fade-up": "fade-up 0.5s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-in-left": "slide-in-left 0.3s ease-out",
        "voice-pulse": "voice-pulse 1.5s ease-in-out infinite",
        "loading-medical": "loading-medical 1.5s ease-in-out infinite",
        "bounce-subtle": "bounce-subtle 2s infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "voice-pulse": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.1)", opacity: "0.8" },
        },
        "loading-medical": {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "glow": {
          "0%": { boxShadow: "0 0 5px rgba(99, 102, 241, 0.5)" },
          "100%": { boxShadow: "0 0 20px rgba(99, 102, 241, 0.8)" },
        },
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      scale: {
        '102': '1.02',
        '103': '1.03',
      },
      blur: {
        'xs': '2px',
      },
      brightness: {
        '25': '.25',
        '175': '1.75',
      },
      contrast: {
        '25': '.25',
        '175': '1.75',
      },
      grayscale: {
        '50': '.5',
      },
      hueRotate: {
        '15': '15deg',
        '30': '30deg',
        '60': '60deg',
        '90': '90deg',
        '180': '180deg',
      },
      invert: {
        '25': '.25',
        '50': '.5',
        '75': '.75',
      },
      saturate: {
        '25': '.25',
        '75': '.75',
        '125': '1.25',
        '175': '1.75',
        '200': '2',
      },
      sepia: {
        '25': '.25',
        '75': '.75',
      },
      // Medical-specific utilities
      aspectRatio: {
        '4/3': '4 / 3',
        '3/2': '3 / 2',
        '2/3': '2 / 3',
        '9/16': '9 / 16',
      },
      lineClamp: {
        '7': '7',
        '8': '8',
        '9': '9',
        '10': '10',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), 
    require("@tailwindcss/typography"),
    // Custom plugin for medical-specific utilities
    function({ addUtilities, theme }: any) {
      const newUtilities = {
        '.text-balance': {
          'text-wrap': 'balance',
        },
        '.text-pretty': {
          'text-wrap': 'pretty',
        },
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        },
        '.scrollbar-medical': {
          'scrollbar-width': 'thin',
          'scrollbar-color': `${theme('colors.medical-purple')} ${theme('colors.slate.200')}`,
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: theme('colors.slate.200'),
            'border-radius': '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme('colors.medical-purple'),
            'border-radius': '4px',
            border: `1px solid ${theme('colors.slate.300')}`,
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: theme('colors.purple.600'),
          },
        },
        '.glass-morphism': {
          background: 'rgba(255, 255, 255, 0.8)',
          'backdrop-filter': 'blur(8px) saturate(1.2) brightness(1.1)',
          '-webkit-backdrop-filter': 'blur(8px) saturate(1.2) brightness(1.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          'box-shadow': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        },
        '.glass-morphism-dark': {
          background: 'rgba(15, 23, 42, 0.8)',
          'backdrop-filter': 'blur(8px) saturate(1.2) brightness(1.1)',
          '-webkit-backdrop-filter': 'blur(8px) saturate(1.2) brightness(1.1)',
          border: '1px solid rgba(51, 65, 85, 0.3)',
          'box-shadow': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        },
        '.medical-focus': {
          '&:focus': {
            outline: '2px solid transparent',
            'outline-offset': '2px',
            'box-shadow': `0 0 0 2px ${theme('colors.medical-purple')}, 0 0 0 4px ${theme('colors.purple.200')}`,
          },
        },
      }
      addUtilities(newUtilities)
    }
  ],
} satisfies Config;
