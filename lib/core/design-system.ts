// MU Waterwear Design System
// Inspired by premium athletic brands like Lululemon for consistency and quality

export const colors = {
  // Primary Brand Colors
  primary: {
    cyan: {
      50: '#ecfeff',
      100: '#cffafe',
      200: '#a5f3fc',
      300: '#67e8f9',
      400: '#22d3ee', // Main brand cyan
      500: '#06b6d4',
      600: '#0891b2',
      700: '#0e7490',
      800: '#155e75',
      900: '#164e63',
    },
  },

  // Neutral Palette (Dark Theme)
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    850: '#0f172a', // Custom dark
    900: '#0f1419', // Darker background
    950: '#020617', // Darkest
  },

  // Semantic Colors
  semantic: {
    success: {
      light: '#bbf7d0',
      main: '#22c55e',
      dark: '#15803d',
    },
    warning: {
      light: '#fef3c7',
      main: '#f59e0b',
      dark: '#d97706',
    },
    error: {
      light: '#fecaca',
      main: '#ef4444',
      dark: '#dc2626',
    },
    info: {
      light: '#dbeafe',
      main: '#3b82f6',
      dark: '#1d4ed8',
    },
  },
} as const

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Consolas', 'monospace'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const

export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
} as const

export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  base: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
} as const

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
} as const

// Component-specific styling patterns
export const components = {
  button: {
    base: 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900',
    variants: {
      primary: 'bg-cyan-400 text-black hover:bg-cyan-500 focus:ring-cyan-400',
      secondary:
        'bg-gray-800 text-white border border-gray-700 hover:bg-gray-700 focus:ring-gray-600',
      outline:
        'border border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white focus:ring-gray-600',
      ghost: 'text-gray-300 hover:bg-gray-800 hover:text-white focus:ring-gray-600',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    },
    sizes: {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    },
  },

  input: {
    base: 'w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors',
    variants: {
      default: 'focus:ring-2 focus:ring-cyan-400/20',
      error: 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20',
      success: 'border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20',
    },
  },

  card: {
    base: 'bg-gray-900 rounded-xl border border-gray-800 shadow-xl',
    variants: {
      default: '',
      elevated: 'shadow-2xl',
      interactive: 'hover:border-gray-700 transition-colors cursor-pointer',
    },
  },

  modal: {
    overlay: 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50',
    container: 'fixed inset-0 z-50 flex items-center justify-center p-4',
    content:
      'bg-gray-900 rounded-xl border border-gray-800 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto',
  },

  dropdown: {
    container:
      'absolute right-0 top-full mt-2 bg-gray-900 rounded-xl border border-gray-800 shadow-2xl z-50',
    item: 'flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white',
  },
} as const

// Accessibility helpers
export const accessibility = {
  screenReader: 'sr-only',
  focusVisible:
    'focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900',
  highContrast: {
    text: 'text-white',
    textSecondary: 'text-gray-300',
    textMuted: 'text-gray-400',
    border: 'border-gray-600',
    background: 'bg-gray-900',
  },
} as const

// Animation presets
export const animations = {
  fadeIn: 'animate-in fade-in duration-200',
  fadeOut: 'animate-out fade-out duration-200',
  slideInFromTop: 'animate-in slide-in-from-top-2 duration-300',
  slideInFromBottom: 'animate-in slide-in-from-bottom-2 duration-300',
  scaleIn: 'animate-in zoom-in-95 duration-200',
  scaleOut: 'animate-out zoom-out-95 duration-200',
} as const

// Layout constraints
export const layout = {
  maxWidth: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  container: 'mx-auto px-4 sm:px-6 lg:px-8',
  section: 'py-12 lg:py-16',
} as const
