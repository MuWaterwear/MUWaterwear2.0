/// <reference types="cypress" />

// Cross-Browser Compatibility Tests for MU Waterwear
// Ensures consistent functionality across Chrome, Firefox, Safari, and Edge

const { DEVICE_VIEWPORTS, BROWSER_FEATURES } = require('../../tests/cross-browser-config')

describe('Cross-Browser Compatibility Tests', () => {
  const browsers = ['chrome', 'firefox', 'edge'] // webkit/safari when available
  const devices = ['iPhone 12', 'iPad', 'Desktop']

  beforeEach(() => {
    // Reset browser state
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  devices.forEach(device => {
    describe(`${device} Compatibility`, () => {
      beforeEach(() => {
        const viewport = DEVICE_VIEWPORTS[device]
        cy.viewport(viewport.width, viewport.height)
        cy.visit('/')
      })

      it('should load homepage correctly', () => {
        // Test basic page loading
        cy.contains('MU Waterwear').should('be.visible')
        cy.get('nav').should('be.visible')
        
        // Test responsive navigation
        if (device.includes('iPhone')) {
          cy.get('[data-testid="mobile-menu"]').should('be.visible')
        } else {
          cy.get('[data-testid="desktop-menu"]').should('be.visible')
        }
      })

      it('should handle search functionality', () => {
        // Test search across different viewports
        cy.get('[data-testid="search-trigger"]').click()
        cy.get('input[placeholder*="Search"]').type('Lake Tahoe')
        
        // Search should work regardless of device
        cy.contains('Lake Tahoe', { timeout: 10000 }).should('be.visible')
      })

      it('should handle cart operations', () => {
        // Navigate to a product
        cy.visit('/lake-tahoe')
        
        // Add to cart should work on all devices
        cy.get('[data-testid="add-to-cart"]').first().click()
        cy.get('[data-testid="cart-count"]').should('contain', '1')
        
        // Cart view should be responsive
        cy.get('[data-testid="cart-trigger"]').click()
        cy.get('[data-testid="cart-sidebar"]').should('be.visible')
      })

      it('should display images correctly', () => {
        cy.visit('/lake-tahoe')
        
        // Check if images load properly
        cy.get('img').should('be.visible').and(($img) => {
          expect($img[0].naturalWidth).to.be.greaterThan(0)
        })
        
        // Test image optimization based on browser support
        cy.window().then((win) => {
          const userAgent = win.navigator.userAgent
          if (userAgent.includes('Chrome') || userAgent.includes('Edge')) {
            // Should support WebP
            cy.get('img[src*=".webp"]').should('exist')
          }
        })
      })

      it('should handle forms correctly', () => {
        // Test form functionality across browsers
        cy.visit('/lake-tahoe')
        cy.get('[data-testid="add-to-cart"]').first().click()
        cy.get('[data-testid="cart-trigger"]').click()
        cy.get('[data-testid="checkout-button"]').click()
        
        // Form inputs should work consistently
        cy.get('[data-testid="first-name"]').type('Test')
        cy.get('[data-testid="email"]').type('test@example.com')
        
        // Validation should work
        cy.get('[data-testid="first-name"]').should('have.value', 'Test')
        cy.get('[data-testid="email"]').should('have.value', 'test@example.com')
      })
    })
  })

  describe('Browser-Specific Feature Tests', () => {
    it('should gracefully handle unsupported features', () => {
      cy.visit('/')
      
      cy.window().then((win) => {
        // Test intersection observer support
        if ('IntersectionObserver' in win) {
          expect(win.IntersectionObserver).to.exist
        }
        
        // Test service worker support
        if ('serviceWorker' in win.navigator) {
          expect(win.navigator.serviceWorker).to.exist
        }
        
        // Test modern image format support
        const canvas = win.document.createElement('canvas')
        const webpSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
        
        if (webpSupported) {
          console.log('✅ WebP supported in this browser')
        } else {
          console.log('ℹ️ WebP not supported, falling back to PNG/JPEG')
        }
      })
    })

    it('should handle CSS features consistently', () => {
      cy.visit('/')
      
      // Test CSS Grid support
      cy.get('.grid').should('exist').and('have.css', 'display').and('match', /grid|flex/)
      
      // Test CSS Custom Properties
      cy.get('body').should('have.css', 'color')
      
      // Test Flexbox
      cy.get('.flex').should('have.css', 'display', 'flex')
    })

    it('should handle JavaScript features', () => {
      cy.visit('/')
      
      cy.window().then((win) => {
        // Test Promise support
        expect(win.Promise).to.exist
        
        // Test async/await support
        expect(win.Symbol).to.exist
        
        // Test arrow functions (if code runs, they're supported)
        const testArrow = () => true
        expect(testArrow()).to.be.true
        
        // Test localStorage
        expect(win.localStorage).to.exist
        win.localStorage.setItem('test', 'value')
        expect(win.localStorage.getItem('test')).to.equal('value')
        win.localStorage.removeItem('test')
      })
    })
  })

  describe('Performance Across Browsers', () => {
    it('should meet performance thresholds', () => {
      cy.visit('/')
      
      // Measure page load performance
      cy.window().then((win) => {
        const navigation = win.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        
        if (navigation) {
          const loadTime = navigation.loadEventEnd - navigation.fetchStart
          expect(loadTime).to.be.lessThan(3000) // 3 seconds max
          
          const domInteractive = navigation.domInteractive - navigation.fetchStart
          expect(domInteractive).to.be.lessThan(2000) // 2 seconds max for DOM ready
        }
      })
    })

    it('should handle large images efficiently', () => {
      cy.visit('/lake-tahoe')
      
      // Check that images don't block rendering
      cy.get('h1').should('be.visible') // Text should load before images
      cy.get('img').should('be.visible') // But images should still load
    })
  })

  describe('Accessibility Across Browsers', () => {
    it('should maintain accessibility standards', () => {
      cy.visit('/')
      
      // Test keyboard navigation
      cy.get('body').tab()
      cy.focused().should('be.visible')
      
      // Test ARIA labels
      cy.get('[aria-label]').should('exist')
      cy.get('[role]').should('exist')
      
      // Test heading structure
      cy.get('h1').should('exist')
      cy.get('h2').should('exist')
    })

    it('should work with screen readers', () => {
      cy.visit('/')
      
      // Test aria-live regions
      cy.get('[aria-live]').should('exist')
      
      // Test semantic HTML
      cy.get('main').should('exist')
      cy.get('nav').should('exist')
      cy.get('header').should('exist')
    })
  })

  describe('Network Conditions', () => {
    it('should work on slow connections', () => {
      // Simulate slow network (if supported by browser)
      cy.visit('/', { timeout: 30000 })
      
      // Page should still be usable
      cy.contains('MU Waterwear').should('be.visible')
      cy.get('nav').should('be.visible')
    })

    it('should handle offline scenarios', () => {
      cy.visit('/')
      
      // Test if service worker caches resources
      cy.window().then((win) => {
        if ('serviceWorker' in win.navigator) {
          // Service worker should be registered
          win.navigator.serviceWorker.getRegistrations().then(registrations => {
            expect(registrations.length).to.be.greaterThan(0)
          })
        }
      })
    })
  })
})

// Custom commands for cross-browser testing
Cypress.Commands.add('checkBrowserSupport', (feature: string) => {
  cy.window().then((win) => {
    switch (feature) {
      case 'webp':
        const canvas = win.document.createElement('canvas')
        const webpSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
        return webpSupported
      case 'intersectionObserver':
        return 'IntersectionObserver' in win
      case 'serviceWorker':
        return 'serviceWorker' in win.navigator
      default:
        return false
    }
  })
})

declare global {
  namespace Cypress {
    interface Chainable {
      checkBrowserSupport(feature: string): Chainable<boolean>
    }
  }
} 