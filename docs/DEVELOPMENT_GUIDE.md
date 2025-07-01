# MU Waterwear Development Guide

## 🌊 Built for Water. Forged for Legends.

This guide covers development practices and architecture for the MU Waterwear e-commerce platform.

## Architecture Overview

### Technology Stack
- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4+
- **State Management**: React Context + Custom Hooks
- **Testing**: Jest + Cypress + React Testing Library
- **Analytics**: Google Analytics 4
- **Email**: Resend API with fallback providers

### Design Principles
1. **Performance First**: Core Web Vitals as primary metrics
2. **Accessibility**: WCAG 2.1 AA compliance
3. **Mobile-First**: Progressive enhancement
4. **Modular Architecture**: Single responsibility components

## Code Organization

### Directory Structure
```
├── app/                  # Next.js App Router pages
├── components/           # React components
├── contexts/            # React Context providers
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
│   ├── cart/           # Cart system modules
│   ├── analytics.ts    # Analytics & monitoring
│   └── performance.ts  # Performance utilities
├── tests/              # Test configuration
└── docs/               # Documentation
```

### Component Guidelines

```tsx
interface ComponentProps {
  /** Required prop description */
  id: string
  /** Optional prop with default */
  isActive?: boolean
}

/**
 * Component - Brief description
 * 
 * @example
 * ```tsx
 * <Component id="example" isActive={true} />
 * ```
 */
export default function Component({ id, isActive = false }: ComponentProps) {
  // Implementation
}
```

## Testing Strategy

### Coverage Targets
- **Unit Tests**: 80%+ coverage for utilities and hooks
- **E2E Tests**: Critical user journeys (search, cart, checkout)
- **Accessibility Tests**: Keyboard navigation and screen readers

### Example Unit Test
```typescript
describe('CartCalculations', () => {
  it('calculates total correctly', () => {
    const items = [{ price: '$10.00', quantity: 2 }]
    const total = CartCalculations.calculateTotal(items)
    expect(total).toBe('$20.00')
  })
})
```

## Performance Standards

### Core Web Vitals Targets
- **FCP**: < 1.8s
- **LCP**: < 2.5s  
- **FID**: < 100ms
- **CLS**: < 0.1

### Optimization Techniques
1. Image optimization with Next.js Image component
2. Code splitting with dynamic imports
3. Resource preloading for critical assets

## Accessibility Guidelines

### WCAG 2.1 AA Requirements
- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatibility
- Color contrast minimum 4.5:1

### Implementation
```tsx
<button
  aria-label="Add product to cart"
  onClick={handleAddToCart}
  disabled={isLoading}
>
  {isLoading ? 'Adding...' : 'Add to Cart'}
</button>
```

## Deployment Process

### Build Commands
```bash
npm run build     # Production build
npm run test:all  # Run all tests
npm run lighthouse # Performance audit
```

### Environment Variables
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
RESEND_API_KEY=re_xxxxxxxxxxxx
NEXT_PUBLIC_BASE_URL=https://muwaterwear.com
```

---

Built with ❤️ for water sports enthusiasts by the MU Waterwear team. 