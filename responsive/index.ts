// Responsive Components
export { default as MobileNavigation } from './components/MobileNavigation'
export { default as MobileShoppingCart } from './components/MobileShoppingCart'
export { default as MobileProductGrid } from './components/MobileProductGrid'
export { 
  default as ResponsiveLayout,
  Responsive,
  MobileOnly,
  DesktopOnly,
  MobileHero,
  MobileSection
} from './components/ResponsiveLayout'

// Responsive Hooks
export { 
  useMobile,
  useSwipeGesture,
  useMobileViewport,
  useMobileKeyboard,
  useHapticFeedback
} from './hooks/useMobile'

// Types
export interface ResponsiveBreakpoints {
  sm: number // 640px
  md: number // 768px
  lg: number // 1024px
  xl: number // 1280px
}

export const breakpoints: ResponsiveBreakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} 